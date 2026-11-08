#!/usr/bin/env node
// Ask the real TypeScript compiler which agents a project declares with an agent SDK.
//
// Usage: node scripts/sdk_truth.mjs <project-dir> > truth.json
//
// `python3 -m core verify-sdk` compares this answer with the SDK readers in core/sdk_agents.py,
// so this file stays independent of them: it asks the type checker what a callee is, by
// following the symbol through its imports to its declaration, and never matches on text.
//
//   OpenAI Agents: `new Agent(...)` or `Agent.create(...)`, where `Agent` is declared in @openai/agents-core.
//   Mastra:        `new Agent(...)`, where `Agent` is declared in @mastra/core.
//   Claude Agent:  `query(...)`, declared in @anthropic-ai/claude-agent-sdk; each key of `options.agents`.
//
// A name is read from the checker's type: a string literal type is a name. Anything else is
// listed under `unreadable` with the reason, never guessed. Install the SDKs where the project's
// node_modules resolve (a parent folder is fine). Lines are 1-based; an agent's line is where its
// `new` or call starts, or for a Claude Agent SDK agent, its key.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(new URL('../ui/package.json', import.meta.url))
const ts = require('typescript')

const root = path.resolve(process.argv[2])
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs)$/
const SKIP = /(^|\/)(node_modules|dist|build|coverage|\.next|\.output|\.vercel)\//

const OPENAI = '@openai/agents'
const MASTRA = '@mastra/core'
const CLAUDE = '@anthropic-ai/claude-agent-sdk'
// The package whose files declare each SDK's own symbols.
const HOMES = [
  { sdk: OPENAI, folder: '@openai/agents-core' },
  { sdk: MASTRA, folder: '@mastra/core' },
  { sdk: CLAUDE, folder: '@anthropic-ai/claude-agent-sdk' },
]

function walk(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') walk(full, found)
    } else if (CODE.test(entry.name)) {
      found.push(full)
    }
  }
  return found
}

const files = walk(root)
  .map((file) => path.relative(root, file).split(path.sep).join('/'))
  .filter((file) => !SKIP.test(file) && !file.endsWith('.d.ts'))

const configPath = path.join(root, 'tsconfig.json')
let options = {}
if (fs.existsSync(configPath)) {
  const read = ts.readConfigFile(configPath, ts.sys.readFile)
  if (!read.error) options = ts.parseJsonConfigFileContent(read.config, ts.sys, root).options
}
options.allowJs = true
options.noEmit = true
options.skipLibCheck = true
options.resolveJsonModule = true
options.allowImportingTsExtensions = true
// A project's own module setting wins, unless it cannot find node_modules in a parent folder.
if (!options.moduleResolution || options.moduleResolution === ts.ModuleResolutionKind.Classic) {
  options.moduleResolution = ts.ModuleResolutionKind.Bundler
  options.module = ts.ModuleKind.ESNext
}
delete options.rootDir
delete options.outDir
delete options.composite
delete options.declaration

const program = ts.createProgram(files.map((file) => path.join(root, file)), options)
const checker = program.getTypeChecker()

const agents = []
const handOffs = []
const unreadable = []
const versions = {}

const rel = (file) => path.relative(root, file).split(path.sep).join('/')
const lineOf = (node) => {
  const source = node.getSourceFile()
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1
}
const where = (node) => ({ path: rel(node.getSourceFile().fileName), line: lineOf(node) })
const unread = (node, why) => unreadable.push({ ...where(node), why })

/** The SDK whose own package declares this symbol, or null. */
function homeOf(declaration) {
  const file = declaration?.getSourceFile().fileName.split(path.sep).join('/')
  if (!file) return null
  return HOMES.find((home) => file.includes(`/node_modules/${home.folder}/`))?.sdk ?? null
}

/** A symbol, followed through imports and re-exports to where it is declared. */
function resolve(node) {
  let symbol = checker.getSymbolAtLocation(node)
  if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
  return symbol
}

/**
 * Whether the receiver of `receiver.method(...)` can be a class: a chain of names whose first name
 * is a class, an import or a namespace. A static call like `Agent.create` is always that. Asking the
 * checker for the method of every other receiver (`a.b.c()` on a variable) makes it infer that
 * receiver's type, and on a package with hundreds of thousands of calls that fills the heap.
 */
function namesAClass(receiver) {
  let first = plain(receiver)
  while (ts.isPropertyAccessExpression(first)) first = plain(first.expression)
  if (!ts.isIdentifier(first)) return false
  const symbol = checker.getSymbolAtLocation(first)
  return !!symbol && (symbol.flags & (ts.SymbolFlags.Alias | ts.SymbolFlags.Class | ts.SymbolFlags.Module)) !== 0
}

/** What a call or `new` calls: the SDK, and the name the callee has in its own module. */
function calleeOf(call) {
  const callee = call.expression
  if (ts.isNewExpression(call)) {
    const symbol = resolve(callee)
    const declaration = symbol?.declarations?.find(ts.isClassDeclaration)
    return declaration?.name ? { sdk: homeOf(declaration), name: declaration.name.text, kind: 'new' } : null
  }
  if (ts.isPropertyAccessExpression(callee)) {
    if (!namesAClass(callee.expression)) return null
    const symbol = resolve(callee.name)
    const declaration = symbol?.declarations?.find((item) => ts.isMethodDeclaration(item) || ts.isMethodSignature(item))
    const owner = declaration?.parent
    if (owner && ts.isClassDeclaration(owner) && owner.name) {
      return { sdk: homeOf(declaration), name: `${owner.name.text}.${callee.name.text}`, kind: 'static' }
    }
    return null
  }
  const symbol = resolve(callee)
  const declaration = symbol?.declarations?.find((item) => ts.isFunctionDeclaration(item) || ts.isVariableDeclaration(item))
  return declaration?.name && ts.isIdentifier(declaration.name) ? { sdk: homeOf(declaration), name: declaration.name.text, kind: 'call' } : null
}

const stringOf = (type) => (type.isStringLiteral() ? type.value : null)

/** The property of an object literal by name, if written there. */
function written(literal, name) {
  return literal.properties.find((item) => item.name && !ts.isComputedPropertyName(item.name) && item.name.getText() === name)
}

/** The type of a property written in an object literal. */
function writtenType(property) {
  if (ts.isPropertyAssignment(property)) return checker.getTypeAtLocation(property.initializer)
  if (ts.isShorthandPropertyAssignment(property)) return checker.getTypeAtLocation(property.name)
  return null
}

/** The name an agent's config gives, or why it can't be read. */
function nameOf(call, label) {
  // `new Agent({ ... } as any)` and `satisfies` wrap the same literal; the wrapper changes no name.
  const config = plain(call.arguments[0])
  if (!config) return unread(call, `${label} has no config`), null
  const literal = ts.isObjectLiteralExpression(config) ? config : null
  let type = null
  if (literal) {
    const property = written(literal, 'name')
    if (!property) return unread(call, `${label} has no name property`), null
    type = writtenType(property)
    if (!type) return unread(call, 'name is written as a method or accessor'), null
  } else {
    const holder = checker.getTypeAtLocation(config)
    const symbol = holder.getProperty('name')
    if (!symbol) return unread(call, `${label} config is not an object literal with a name`), null
    type = checker.getTypeOfSymbolAtLocation(symbol, config)
  }
  const value = stringOf(type)
  if (value === null) return unread(call, `name is not a string literal type (${checker.typeToString(type)})`), null
  return value
}

/** Strip the wrappers that don't change which value an expression is. */
function plain(node) {
  while (
    node &&
    (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isNonNullExpression(node) || ts.isSatisfiesExpression(node) || ts.isAwaitExpression(node))
  ) {
    node = node.expression
  }
  return node
}

// Each agent expression in the program, by node, to find where a hand-off points.
const made = new Map()

/** The agent an expression is: an agent expression, a `handoff(x)` of one, or a variable that holds either. */
function agentAt(node, hops = 4) {
  node = plain(node)
  if (made.has(node)) return made.get(node)
  if (ts.isCallExpression(node) && calleeOf(node)?.sdk === OPENAI && calleeOf(node).name === 'handoff') {
    return node.arguments[0] && hops ? agentAt(node.arguments[0], hops - 1) : null
  }
  if (hops && (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node))) {
    const symbol = resolve(ts.isPropertyAccessExpression(node) ? node.name : node)
    for (const declaration of symbol?.declarations ?? []) {
      if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
        const found = agentAt(declaration.initializer, hops - 1)
        if (found) return found
      }
    }
  }
  return null
}

// How often each function or class of an SDK is called, to show the SDK's symbols resolved.
const seen = {}
const calls = []
for (const file of files) {
  const source = program.getSourceFile(path.join(root, file))
  if (!source) continue
  const visit = (node) => {
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) calls.push(node)
    ts.forEachChild(node, visit)
  }
  visit(source)
}

// First pass: the agents.
for (const call of calls) {
  const callee = calleeOf(call)
  if (!callee?.sdk) continue
  seen[`${callee.sdk} ${callee.name}`] = (seen[`${callee.sdk} ${callee.name}`] ?? 0) + 1
  const isAgent =
    (callee.sdk === OPENAI && (callee.name === 'Agent' || callee.name === 'Agent.create')) ||
    (callee.sdk === MASTRA && callee.name === 'Agent' && callee.kind === 'new')
  if (isAgent) {
    const name = nameOf(call, 'Agent')
    if (name === null) continue
    const record = { sdk: callee.sdk, name, ...where(call) }
    agents.push(record)
    made.set(call, record)
  } else if (callee.sdk === CLAUDE && callee.name === 'query') {
    readQuery(call)
  }
}

/** Each key of `options.agents` in a `query` call, from the checker's type of the argument. */
function readQuery(call) {
  const [argument] = call.arguments
  if (!argument) return
  const step = (node, type, key) => {
    const symbol = type?.getProperty(key)
    return symbol ? { symbol, type: checker.getTypeOfSymbolAtLocation(symbol, node) } : null
  }
  const options = step(argument, checker.getTypeAtLocation(argument), 'options')
  const list = options && step(argument, options.type.getNonNullableType(), 'agents')
  if (!list) return
  const type = list.type.getNonNullableType()
  const keys = checker.getPropertiesOfType(type)
  if (!keys.length && type.getStringIndexType()) return unread(call, `agents keys are not literal (${checker.typeToString(type)})`)
  for (const key of keys) {
    const declaration = key.declarations?.[0]
    if (!declaration || homeOf(declaration) || declaration.getSourceFile().fileName.includes('/node_modules/')) {
      unread(call, `agent key ${key.getName()} is declared outside the project`)
      continue
    }
    const record = { sdk: CLAUDE, name: key.getName(), ...where(declaration) }
    agents.push(record)
    made.set(declaration, record)
  }
}

// Second pass: OpenAI hand-offs, now that every agent is known.
for (const call of calls) {
  const callee = calleeOf(call)
  if (callee?.sdk !== OPENAI || !['Agent', 'Agent.create'].includes(callee.name)) continue
  const from = made.get(call)
  const config = plain(call.arguments[0])
  if (!from || !config || !ts.isObjectLiteralExpression(config)) continue
  const property = written(config, 'handoffs')
  if (!property || !ts.isPropertyAssignment(property)) continue
  let list = plain(property.initializer)
  if (ts.isIdentifier(list)) {
    const declaration = resolve(list)?.declarations?.find(ts.isVariableDeclaration)
    list = declaration?.initializer ? plain(declaration.initializer) : list
  }
  if (!ts.isArrayLiteralExpression(list)) {
    unread(property, 'handoffs is not an array literal')
    continue
  }
  for (const item of list.elements) {
    const to = agentAt(item)
    if (to) handOffs.push({ from: from.name, to: to.name, path: where(item).path, line: where(item).line })
    else unread(item, 'hand-off does not resolve to an agent declared in the project')
  }
}

// The SDK versions installed where the project resolves them.
for (const [name, label] of [
  [OPENAI, OPENAI],
  ['@openai/agents-core', '@openai/agents-core'],
  [MASTRA, MASTRA],
  [CLAUDE, CLAUDE],
]) {
  for (let dir = root; ; dir = path.dirname(dir)) {
    const file = path.join(dir, 'node_modules', name, 'package.json')
    if (fs.existsSync(file)) {
      versions[label] = JSON.parse(fs.readFileSync(file, 'utf8')).version
      break
    }
    if (dir === path.dirname(dir)) break
  }
}

const order = (a, b) => a.path.localeCompare(b.path) || a.line - b.line
console.log(
  JSON.stringify(
    {
      project: path.basename(root),
      versions,
      files: files.length,
      sdk_calls: seen,
      agents: agents.sort(order),
      hand_offs: handOffs.sort(order),
      unreadable: unreadable.sort(order),
    },
    null,
    2,
  ),
)
