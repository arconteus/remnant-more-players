# remnant-more-players

[![Installation](https://img.shields.io/badge/docs-installation-5b8def)](docs/installation.md)
[![Development](https://img.shields.io/badge/docs-development-6f42c1)](docs/development.md)
[![Technical](https://img.shields.io/badge/docs-technical-555555)](docs/technical.md)
[![Publishing](https://img.shields.io/badge/docs-publishing-2da44e)](docs/publishing.md)

Experimental five-player mod for **Remnant: From the Ashes**.

It combines a PAK that sets the player limit to five with a small Windows helper that updates the session capacity while the game is running. The game executable is never modified on disk.

## Install

1. Download or build the release files.
2. Copy the contents of `dist/Remnant` into the game's `Remnant` directory.
3. Remove or disable older `4player.pak` and four-player variants.
4. The host launches the game with `Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs`.
5. Wait for **“Mod de 5 jugadores activo”**, then create a new session.

Guests need `zzzz_FivePlayers_Experimental_P.pak` in their `Remnant/Content/Paks` folder. The launcher recognizes verified Epic Games and Steam builds. Epic requires an additional in-memory EOS session patch; Steam uses the PAK session limit. Five-player gameplay and travel transitions still require testing.

## Development

Requires Windows, Node.js 18 or newer, and a local game installation:

```powershell
$env:REMNANT_GAME_DIR = 'C:\Program Files\Epic Games\RemnantFromTheAshes'
npm run build
npm test
```

Or run the complete development workflow:

```powershell
npm run forge
npm run forge -- all
```

More information:

- [Installation and usage](docs/installation.md)
- [Building and project structure](docs/development.md)
- [Technical design and limitations](docs/technical.md)
- [Publishing checklist](docs/publishing.md)

## License

Original code and documentation are available under the [MIT License](LICENSE). Game files and other third-party content are excluded.
