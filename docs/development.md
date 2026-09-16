# Development

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Installation](https://img.shields.io/badge/previous-installation-5b8def)](installation.md)
[![Technical](https://img.shields.io/badge/next-technical-555555)](technical.md)

## Requirements

- Windows 10 or 11
- Node.js 18 or newer
- A supported local Remnant installation
- PowerShell 5.1 or newer

Forge installs and verifies npm dependencies. The current project has no third-party npm runtime packages, but the setup step still creates a reproducible lockfile and checks the local toolchain.

## Forge

Forge is the developer entry point. From the repository root:

```powershell
npm run forge
```

The default command runs the complete workflow. Use `npm run forge -- menu` for the interactive menu. Direct commands are available for automation:

```powershell
npm run forge -- setup
npm run forge -- format
npm run forge -- test
npm run forge -- check
npm run forge -- build
npm run forge -- all
```

`all` installs dependencies, formats the repository, validates it, runs tests and builds the release files.

## Pull request checks

GitHub Actions runs `npm ci --ignore-scripts` and `npm run check` for every pull request. These checks cover formatting, documentation links, runtime definitions and the isolated Windows memory-helper test.

The hosted runner does not contain Remnant or the third-party Survival PAK, so it deliberately skips installed-executable SHA256 verification and the combined PAK build. `npm run forge` performs those local checks when the required game files are available.

You may also run `node src/build.cjs "C:\path\to\RemnantFromTheAshes"`.

The build reads the original game configuration and the locally installed `zmore_survival_items_P.pak`, produces one combined PAK under `dist/`, substitutes its hash into the runtime helper and writes validation data to `reports/`. It does not install the result or patch a running game.

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

---

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Installation](https://img.shields.io/badge/previous-installation-5b8def)](installation.md)
[![Technical](https://img.shields.io/badge/next-technical-555555)](technical.md)
