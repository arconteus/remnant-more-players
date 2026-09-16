import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const root = dirname(scripts)
const npm = process.platform === 'win32'
  ? { command: process.env.ComSpec ?? 'cmd.exe', args: ['/d', '/s', '/c', 'npm'] }
  : { command: 'npm', args: [] }

const actions = {
  setup: ['Install and verify development dependencies', () => run(npm.command, [...npm.args, 'install', '--ignore-scripts'])],
  test: ['Test the project', () => run(npm.command, [...npm.args, 'test'])],
  format: ['Format source and documentation', () => run(process.execPath, [join(scripts, 'format.cjs')])],
  check: ['Run formatting checks and tests', () => run(process.execPath, [join(scripts, 'check.cjs')])],
  build: ['Build release files', () => run(npm.command, [...npm.args, 'run', 'build'])],
  all: ['Set up, format, test and build', async () => {
    await actions.setup[1]()
    await actions.format[1]()
    await actions.check[1]()
    await actions.build[1]()
  }],
  menu: ['Open the interactive command menu', menu],
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code ?? 'unknown'}`)))
  })
}

function help() {
  console.log(`remnant-more-players Forge

Usage:
  npm run forge                 Run the complete workflow
  npm run forge -- <command>

Commands:
  setup    Install and verify development dependencies
  test     Test the runtime helper and combined PAK
  format   Format source and documentation
  check    Check formatting and run tests
  build    Build the combined PAK and launch helpers
  all      Set up, format, check and build everything
  menu     Open the interactive command menu
  help     Show this message`)
}

async function menu() {
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  console.log('\n◆ REMNANT MORE PLAYERS · FORGE\n')
  const keys = ['all', 'setup', 'test', 'format', 'check', 'build']
  keys.forEach((key, index) => console.log(`  ${index + 1}. ${actions[key][0]}`))
  console.log('  0. Exit')
  const answer = await prompt.question('\nSelect an action: ')
  prompt.close()
  if (answer === '0' || answer.trim() === '') return
  const action = actions[keys[Number(answer) - 1]]
  if (!action) throw new Error(`Unknown selection: ${answer}`)
  await action[1]()
}

try {
  const command = process.argv[2]
  if (!command) await actions.all[1]()
  else if (['help', '--help', '-h'].includes(command)) help()
  else if (actions[command]) await actions[command][1]()
  else throw new Error(`Unknown Forge command: ${command}`)
} catch (error) {
  console.error(`Forge error: ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
}
