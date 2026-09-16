const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const check = process.argv.includes('--check')
const extensions = new Set(['.cjs', '.cmd', '.json', '.md', '.mjs', '.ps1', '.vbs'])
const ignored = new Set(['.git', 'dist', 'node_modules', 'private', 'reports'])
const changed = []

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) visit(file)
    else if (extensions.has(path.extname(entry.name))) format(file)
  }
}

function format(file) {
  const original = fs.readFileSync(file, 'utf8')
  let formatted = original.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n*$/, '\n')
  if (path.extname(file) === '.json') formatted = `${JSON.stringify(JSON.parse(formatted), null, 2)}\n`
  if (formatted === original) return
  changed.push(path.relative(root, file))
  if (!check) fs.writeFileSync(file, formatted)
}

visit(root)
if (changed.length) {
  console.log(`${check ? 'Formatting required' : 'Formatted'}:\n${changed.map((file) => `- ${file}`).join('\n')}`)
  if (check) process.exitCode = 1
} else console.log('Formatting is clean.')
