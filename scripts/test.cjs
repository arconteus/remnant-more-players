const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const runtime = fs.readFileSync(path.join(root, 'runtime', 'ndc_Activar-5-Jugadores.ps1'), 'utf8')
const platforms = [
  {
    store: 'Epic Games',
    hash: '078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f',
    executable: 'C:/Program Files/Epic Games/RemnantFromTheAshes/Remnant/Binaries/Win64/Remnant-Win64-Shipping.exe',
    launch: 'com.epicgames.launcher://apps/',
  },
  {
    store: 'Steam',
    hash: '05c2d85e6c26f7d9aab5d90979f0b487283e180303422f05a7cc3bfa1f13be4c',
    executable: 'C:/Program Files (x86)/Steam/steamapps/common/Remnant/Remnant/Binaries/Win64/Remnant-Win64-Shipping.exe',
    launch: 'steam://run/617290',
  },
]

for (const platform of platforms) {
  if (!runtime.includes(platform.hash) || !runtime.includes(platform.launch)) {
    throw new Error(`${platform.store} runtime definition is incomplete`)
  }
  if (fs.existsSync(platform.executable)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(platform.executable)).digest('hex')
    if (actual !== platform.hash) throw new Error(`${platform.store} executable hash changed: ${actual}`)
  }
}

const helperTest = spawnSync(
  'powershell.exe',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'src', 'test-helper.ps1')],
  { cwd: root, stdio: 'inherit' },
)
if (helperTest.error) throw helperTest.error
if (helperTest.status !== 0) process.exit(helperTest.status ?? 1)
console.log('PASS: Epic and Steam definitions match installed executables when present.')
