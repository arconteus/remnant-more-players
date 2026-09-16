# Development

## Requirements

- Windows 10 or 11
- Node.js 18 or newer
- A supported local Remnant installation
- PowerShell 5.1 or newer

No npm packages are required.

## Build and test

From the repository root:

```powershell
$env:REMNANT_GAME_DIR = 'C:\Program Files\Epic Games\RemnantFromTheAshes'
npm run build
npm test
```

You may also run `node src/build.cjs "C:\path\to\RemnantFromTheAshes"`.

The build reads the original configuration from the installed game, produces the PAK under `dist/`, substitutes the generated PAK hash into the runtime helper and writes validation data to `reports/`. It does not install the result or patch a running game.

## Structure

```text
runtime/   Runtime launcher and helper templates
src/       PAK builder, reader and helper test
docs/      User, technical and publishing documentation
dist/      Generated release layout; ignored by Git
reports/   Generated validation reports; ignored by Git
private/   Local research and extracted files; ignored by Git
```

Install helpers from `dist`, because the source PowerShell template contains a PAK hash placeholder that the build replaces.
