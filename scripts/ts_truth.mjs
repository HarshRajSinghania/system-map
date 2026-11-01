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

function literal(node) {
  return ts.isStringLiteralLike(node) ? node.text : null
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

  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      named.add(literal(node.moduleSpecifier))
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

fs.writeFileSync(out, JSON.stringify({ files, imports, tableCalls }))
console.log(`read ${files.length} files`)
