# remnant-more-players

Experimental five-player mod for **Remnant: From the Ashes**.

It combines a PAK that sets the player limit to five with a small Windows helper that updates the session capacity while the game is running. The game executable is never modified on disk.

## Install

1. Download or build the release files.
2. Copy the contents of `dist/Remnant` into the game's `Remnant` directory.
3. Remove or disable older `4player.pak` and four-player variants.
4. The Epic host launches the game with `Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs`.
5. Wait for **“Mod de 5 jugadores activo”**, then create a new session.

Guests need `zzzz_FivePlayers_Experimental_P.pak` in their `Remnant/Content/Paks` folder. The current automatic launcher and memory patch support the verified Epic executable only. Five-player gameplay, travel transitions and Steam hosting still require testing.

## Development

Requires Windows, Node.js 18 or newer, and a local game installation:

```powershell
$env:REMNANT_GAME_DIR = 'C:\Program Files\Epic Games\RemnantFromTheAshes'
npm run build
npm test
```

More information:

- [Installation and usage](docs/installation.md)
- [Building and project structure](docs/development.md)
- [Technical design and limitations](docs/technical.md)
- [Publishing checklist](docs/publishing.md)

## License

Original code and documentation are available under the [MIT License](LICENSE). Game files and other third-party content are excluded.
