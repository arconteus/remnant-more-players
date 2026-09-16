const assert = require('node:assert')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { open, extract } = require('./pak.cjs')
const paths = require('./paths.cjs')

require('./build-survival.cjs')

function u32(value) {
  const buffer = Buffer.alloc(4)
  buffer.writeUInt32LE(value)
  return buffer
}

function u64(value) {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(BigInt(value))
  return buffer
}

function string(value) {
  const buffer = Buffer.from(`${value}\0`)
  return Buffer.concat([u32(buffer.length), buffer])
}

function sha1(buffer) {
  return crypto.createHash('sha1').update(buffer).digest()
}

function createPak(files) {
  const payload = []
  const indexEntries = []
  let offset = 0
  for (const file of files) {
    const entry = Buffer.concat([
      u64(offset),
      u64(file.data.length),
      u64(file.data.length),
      u32(0),
      sha1(file.data),
      Buffer.alloc(5),
    ])
    const localEntry = Buffer.from(entry)
    localEntry.writeBigUInt64LE(0n)
    payload.push(localEntry, file.data)
    indexEntries.push(string(file.name), entry)
    offset += localEntry.length + file.data.length
  }
  const index = Buffer.concat([string('../../../'), u32(files.length), ...indexEntries])
  return Buffer.concat([
    ...payload,
    index,
    u32(0x5a6f12e1),
    u32(3),
    u64(offset),
    u64(index.length),
    sha1(index),
  ])
}

const gamePak = open(path.join(paths.input, 'pakchunk0-WindowsNoEditor.pak'))
const configEntry = gamePak.entries.find((entry) => entry.name === 'Remnant/Config/DefaultGame.ini')
assert(configEntry, 'DefaultGame.ini is unavailable')
const configSource = extract(gamePak, configEntry).toString('utf8')
assert.equal((configSource.match(/^MaxPlayers=3\r?$/gm) || []).length, 1)
const config = Buffer.from(configSource.replace(/^MaxPlayers=3\r?$/m, 'MaxPlayers=5\r'))

const shopPatchPath = path.join(paths.output, 'zzzzz_SurvivalShop_4Players_P.pak')
const shopPatch = open(shopPatchPath)
const files = [
  { name: configEntry.name, data: config },
  ...shopPatch.entries.map((entry) => ({ name: entry.name, data: extract(shopPatch, entry) })),
]
const output = path.join(paths.output, 'zzzz_NDC_MorePlayers_P.pak')
const pak = createPak(files)
fs.writeFileSync(output, pak)
fs.unlinkSync(shopPatchPath)

const check = open(output)
assert.equal(check.entries.length, files.length)
for (let index = 0; index < files.length; index++) {
  assert(extract(check, check.entries[index]).equals(files[index].data))
}

const executable = fs.readFileSync(path.join(paths.game, 'Remnant/Binaries/Win64/Remnant-Win64-Shipping.exe'))
const executableHash = crypto.createHash('sha256').update(executable).digest('hex')
const platforms = {
  '078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f': {
    store: 'Epic Games',
    memoryPatch: true,
    instructionRVA: '0x59A639',
  },
  '05c2d85e6c26f7d9aab5d90979f0b487283e180303422f05a7cc3bfa1f13be4c': {
    store: 'Steam',
    memoryPatch: false,
  },
}
const platform = platforms[executableHash]
assert(platform, `Unsupported executable SHA256: ${executableHash}`)
if (platform.memoryPatch) {
  const offset = 0x599639 + 1024
  assert.equal(executable.subarray(offset, offset + 7).toString('hex'), 'c7400803000000')
}

const pakHash = crypto.createHash('sha256').update(pak).digest('hex')
const report = {
  status: 'Experimental combined five-player and Survival shop build',
  pak: output,
  pakSHA256: pakHash,
  entries: files.length,
  survivalShop: {
    source: 'Survival vendor tweaks v0.5 by ACan (Nexus uploader: acanthan)',
    sourceUrl: 'https://www.nexusmods.com/remnantfromtheashes/mods/86',
    behavior: 'Expanded three-player stock is enabled for four and five players',
  },
  buildExecutable: { store: platform.store, sha256: executableHash },
  supportedExecutables: platforms,
  validation: [
    'Combined PAK index SHA1 valid',
    'Every combined entry passed byte-for-byte extraction',
    'Survival shop tables passed structural assertions during build',
    'Supported executable hash matches local installation',
    ...(platform.memoryPatch ? ['Epic native instruction matches local executable'] : []),
  ],
  limitations: [
    'Five-player gameplay still requires a complete group test',
    'Survival inventory changes require in-game verification',
    'Redistribution of the third-party Survival assets requires permission from ACan',
  ],
}
fs.writeFileSync(path.join(paths.reports, 'build-report.json'), JSON.stringify(report, null, 2))
console.log(report)

const helperOutput = path.join(paths.output, 'FivePlayers')
fs.mkdirSync(helperOutput, { recursive: true })
for (const name of [
  'ndc_Activar-5-Jugadores.ps1',
  'ndc_Activar-5-Jugadores.cmd',
  'ndc_Jugar-Remnant.vbs',
]) {
  const source = fs.readFileSync(path.join(paths.project, 'runtime', name), 'utf8')
  fs.writeFileSync(path.join(helperOutput, name), source.replaceAll('__PAK_SHA256__', pakHash))
}
fs.copyFileSync(path.join(paths.project, 'README.md'), path.join(paths.project, 'dist/README.md'))
