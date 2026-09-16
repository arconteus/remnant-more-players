const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const npm = process.platform === 'win32'
  ? { command: process.env.ComSpec ?? 'cmd.exe', args: ['/d', '/s', '/c', 'npm'] }
  : { command: 'npm', args: [] }

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
for (const name of ['installation.md', 'development.md', 'technical.md', 'publishing.md']) {
  const contents = fs.readFileSync(path.join(root, 'docs', name), 'utf8')
  if (!contents.includes('../README.md')) throw new Error(`${name} has no link back to README.md`)
}
run(process.execPath, [path.join(root, 'scripts', 'format.cjs'), '--check'])
run(npm.command, [...npm.args, 'test'])
console.log('All project checks passed.')
