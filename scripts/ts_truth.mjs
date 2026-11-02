#!/usr/bin/env node
// Ask the real TypeScript compiler what a project imports and which tables it calls.
//
// Usage: node scripts/ts_truth.mjs <project-dir> <out.json>
//
// `core/verify.py` compares this answer with the text-based extractor, so this file stays
// independent of it: it uses the compiler's own parser and module resolution, and reads the
// code as a syntax tree.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(new URL('../ui/package.json', import.meta.url))
const ts = require('typescript')

const root = path.resolve(process.argv[2])
const out = process.argv[3]
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs)$/
const SKIP = /(^|\/)(node_modules|dist|build|coverage|\.next|\.output|\.vercel)\//
const GENERATED = /(\.gen\.\w+|\.generated\.\w+|(^|\/)database\.types\.ts|(^|\/)supabase\/types\.ts)$/

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

const codeRoot = fs.existsSync(path.join(root, 'src')) ? path.join(root, 'src') : root
const files = walk(codeRoot)
  .map((file) => path.relative(root, file).split(path.sep).join('/'))
  .filter((file) => !SKIP.test(file) && !GENERATED.test(file) && !file.endsWith('.d.ts'))

const configPath = path.join(root, 'tsconfig.json')
const options = fs.existsSync(configPath)
  ? ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, root).options
  : {}
options.allowJs = true
options.moduleResolution = ts.ModuleResolutionKind.Bundler
options.module = ts.ModuleKind.ESNext
options.allowImportingTsExtensions = true
options.resolveJsonModule = true

const imports = {}
const tableCalls = {}
const complexity = {}
const DECISION_OPERATORS = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
])

/** One for each place the code can take a second path, read from the syntax tree. */
function isDecision(node) {
  return (
    ts.isIfStatement(node) ||
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node) ||
    ts.isWhileStatement(node) ||
    ts.isDoStatement(node) ||
    ts.isCaseClause(node) ||
    ts.isCatchClause(node) ||
    ts.isConditionalExpression(node) ||
    (ts.isBinaryExpression(node) && DECISION_OPERATORS.has(node.operatorToken.kind))
  )
}

function literal(node) {
  return ts.isStringLiteralLike(node) ? node.text : null
}

const SQL_START = /^\s*(?:(SELECT|INSERT|UPDATE|DELETE|REPLACE|WITH)|(select|insert|update|delete|replace|with))\b/
const SQL_TABLE = /\b(from|join|into|update)\s+["'`\[]?([A-Za-z_]\w*)/gi
const NOT_TABLES = new Set(['set', 'select', 'or', 'only'])

/** The tables named in one string, if it opens like a query. */
function sqlUses(body) {
  const opening = SQL_START.exec(body)
  if (!opening) return []
  const verb = (opening[1] ?? opening[2]).toUpperCase()
  const seen = new Map()
  for (const match of body.matchAll(SQL_TABLE)) {
    const keyword = match[1].toUpperCase()
    const table = match[2]
    if (NOT_TABLES.has(table.toLowerCase())) continue
    const writes = keyword === 'INTO' || keyword === 'UPDATE' || (keyword === 'FROM' && verb === 'DELETE')
    const access = writes ? 'write' : 'read'
    seen.set(`${table}|${access}`, { table, access })
  }
  return [...seen.values()]
}

/** Walk one `.from("x")` chain outward to the first read or write call on it. */
function accessOf(call) {
  let node = call
  while (node.parent) {
    const parent = node.parent
    if (ts.isPropertyAccessExpression(parent) && ts.isCallExpression(parent.parent)) {
      const name = parent.name.text
      if (['insert', 'upsert', 'update', 'delete'].includes(name)) return 'write'
      if (name === 'select') return 'read'
      node = parent.parent
    } else {
      break
    }
  }
  return 'read'
}

for (const file of files) {
  const full = path.join(root, file)
  const text = fs.readFileSync(full, 'utf8')
  const kind = /\.(tsx|jsx)$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(full, text, ts.ScriptTarget.Latest, true, kind)
  const named = new Set()
  let paths = 0

  const visit = (node) => {
    if (isDecision(node)) paths += 1
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      named.add(literal(node.moduleSpecifier))
    }
    if ((ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) && !/\.test\.|\.spec\.|__tests__/.test(file)) {
      const body = node.getText(source).slice(1, -1)
      if (sqlUses(body).length) (tableCalls[file] ??= []).push(...sqlUses(body))
    }
    if (ts.isCallExpression(node)) {
      const [first] = node.arguments
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword && first && literal(first)) named.add(literal(first))
      if (ts.isIdentifier(node.expression) && node.expression.text === 'require' && first && literal(first)) {
        named.add(literal(first))
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'from' && first && literal(first)) {
        const receiver = node.expression.expression.getText(source)
        const isStorage = /\.storage$|^storage$/.test(receiver.replace(/\s+/g, ''))
        if (!isStorage && !/\.test\.|\.spec\.|__tests__/.test(file)) {
          ;(tableCalls[file] ??= []).push({ table: literal(first), access: accessOf(node) })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (!/\.test\.|\.spec\.|__tests__/.test(file)) complexity[file] = paths

  const resolved = new Set()
  for (const specifier of named) {
    const bare = specifier.split('?')[0]
    const found = ts.resolveModuleName(bare, full, options, ts.sys).resolvedModule
    if (!found || found.isExternalLibraryImport) continue
    const relative = path.relative(root, found.resolvedFileName).split(path.sep).join('/')
    if (!relative.startsWith('..')) resolved.add(relative)
  }
  if (resolved.size) imports[file] = [...resolved].sort()
}

const DRIZZLE_WRITES = new Set(['insert', 'update', 'delete'])
const DRIZZLE_READS = new Set(['from', 'innerJoin', 'leftJoin', 'rightJoin', 'fullJoin', 'crossJoin', '$count'])
const DRIZZLE_QUERIES = new Set(['findMany', 'findFirst'])

/** A called function's name in its own module, seen through `import { a as b }`. */
function calledName(checker, callee) {
  if (ts.isPropertyAccessExpression(callee)) return callee.name.text
  const named = checker.getSymbolAtLocation(callee)?.declarations?.find(ts.isImportSpecifier)
  return named ? (named.propertyName ?? named.name).text : callee.getText()
}

/** The SQL name of the table a `const` was made as, or null if it wasn't made by `sqliteTable`. */
function tableMadeBy(checker, declaration) {
  const call = declaration && ts.isVariableDeclaration(declaration) ? declaration.initializer : null
  if (!call || !ts.isCallExpression(call) || calledName(checker, call.expression) !== 'sqliteTable') return null
  return call.arguments[0] ? literal(call.arguments[0]) : null
}

/** The table a name in code points at, following imports and re-exports as the compiler does. */
function tableAt(checker, node) {
  const at = ts.isPropertyAccessExpression(node) ? node.name : node
  if (!ts.isIdentifier(at)) return null
  let symbol = checker.getSymbolAtLocation(at)
  if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
  return tableMadeBy(checker, symbol?.valueDeclaration)
}

/**
 * Drizzle takes the table itself, as in `db.insert(users)`. Only the type checker can say what
 * such a name points at, so these calls are read through a whole program.
 */
function readDrizzle() {
  const program = ts.createProgram(files.map((file) => path.join(root, file)), options)
  const checker = program.getTypeChecker()
  const exported = new Map()
  const collect = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const table = tableMadeBy(checker, node)
      if (table) exported.set(node.name.text, table)
    }
    ts.forEachChild(node, collect)
  }
  for (const file of files) collect(program.getSourceFile(path.join(root, file)))

  for (const file of files) {
    if (/\.test\.|\.spec\.|__tests__/.test(file)) continue
    const add = (table, access) => (tableCalls[file] ??= []).push({ table, access })
    const visit = (node) => {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        const callee = node.expression
        const name = callee.name.text
        const owner = callee.expression
        if (
          DRIZZLE_QUERIES.has(name) &&
          ts.isPropertyAccessExpression(owner) &&
          ts.isPropertyAccessExpression(owner.expression) &&
          owner.expression.name.text === 'query' &&
          exported.has(owner.name.text)
        ) {
          add(exported.get(owner.name.text), 'read')
        }
        if (DRIZZLE_WRITES.has(name) || DRIZZLE_READS.has(name)) {
          let first = node.arguments[0]
          if (first && ts.isCallExpression(first) && calledName(checker, first.expression) === 'alias') first = first.arguments[0]
          const table = first ? tableAt(checker, first) : null
          if (table) add(table, DRIZZLE_WRITES.has(name) ? 'write' : 'read')
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(program.getSourceFile(path.join(root, file)))
  }
}

if (files.some((file) => fs.readFileSync(path.join(root, file), 'utf8').includes('drizzle-orm/sqlite-core'))) readDrizzle()

fs.writeFileSync(out, JSON.stringify({ files, imports, tableCalls, complexity }))
console.log(`read ${files.length} files`)
