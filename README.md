# Remnant: From the Ashes — Five Players

Experimental five-player session mod for one verified Epic Games executable. The previous FOUR-player version was reported working in a mixed Steam/Epic group. FIVE players have not yet been tested. This is not a claim of compatibility with every game build or game mode.

## Install and play

Copy the contents of the generated `dist/Remnant` folder into the game's `Remnant` folder. Disable earlier four-player PAKs before installing this version; restart the game before using the new helper.

The Epic host double-clicks `Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs`. It opens the installed game through Epic and applies the patch in a hidden helper process. A brief confirmation appears when ready; create a new session after that. Errors appear in a dialog, and the latest result is saved in `ndc_estado.txt`. Use this launcher each time; launching directly from Epic does not automatically run the helper. Windows Script Host / VBScript is required for this launcher. The CMD remains available as a manual fallback. Guests use the same `zzzz_FivePlayers_Experimental_P.pak`; the helper does not support a different Steam executable. Use the verified Epic installation as host for mixed groups.

The PAK sets `Engine.GameSession.MaxPlayers=5`. The helper changes one immediate byte in `UMatchmaker::CreateSession` in memory, from 3 to 5. It does not modify the executable on disk. It checks the executable and PAK SHA256, the process path and original instruction, and verifies the resulting bytes. Closing the game removes the memory change.

Supported executable SHA256: `078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f`.

Doors/zone travel are not patched. Survival shops need the separate survival-shop compatibility project. That fix still needs gameplay verification.

## Build from source

Requires Windows, Node.js 18 or newer, and a local game installation. No npm dependencies are required. In this project folder:

```powershell
$env:REMNANT_GAME_DIR = 'C:\Program Files\Epic Games\RemnantFromTheAshes'
npm run build
npm test
```

Alternatively: `node src/build.cjs "C:\path\to\RemnantFromTheAshes"`. When this folder remains under `game/mod-work`, the game path is detected by location. Building writes only to `dist/` and `reports/`; it does not install the mod or patch a running game.

`runtime/` contains the maintained helper template. The builder substitutes __PAK_SHA256__ with the generated PAK hash; install the helper from dist, not the template. `src/` contains the builder, PAK reader and a test of the helper on private test memory. `reports/` contains generated verification output. `private/research/` preserves the earlier investigation, including historical scripts with old paths; it is not part of the supported build workflow.

For local uninstall, close the game, remove the mod PAK and the launcher and helper files. Other mods need not be removed.

## Publishing

See [PUBLISHING.md](PUBLISHING.md). No files have been uploaded.

## License

The original code and documentation in this project are licensed under the [MIT License](LICENSE). Third-party game content is excluded and remains subject to its respective owners' rights.



