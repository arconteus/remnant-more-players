# remnant-more-players

[![Installation](https://img.shields.io/badge/docs-installation-5b8def)](docs/installation.md)
[![Development](https://img.shields.io/badge/docs-development-6f42c1)](docs/development.md)
[![Technical](https://img.shields.io/badge/docs-technical-555555)](docs/technical.md)
[![Publishing](https://img.shields.io/badge/docs-publishing-2da44e)](docs/publishing.md)

Experimental five-player mod for **Remnant: From the Ashes**, compatible with the verified Epic Games and Steam executables. Its single PAK also includes expanded Survival vendor inventory for groups of four or five players.

## Install and play

1. Copy the contents of `dist/Remnant` into the game's `Remnant` directory.
2. Remove older four-player, five-player and separate Survival shop compatibility PAKs.
3. Every player installs `zzzz_NDC_MorePlayers_P.pak`.
4. The host opens `Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs` and waits for the success message before creating the session.

Epic hosting uses a verified in-memory EOS session patch. Steam uses the session limit in the PAK. The executable is never modified on disk. Five-player gameplay, mixed-store travel and the expanded shop still require a complete in-game group test.

See [Installation and usage](docs/installation.md) for full instructions.

## Development with Forge

Forge is the single developer entry point. It prepares dependencies, formats the repository, runs checks and builds the release:

```powershell
npm run forge
```

That command runs the complete workflow. Use `npm run forge -- menu` for its interactive menu, or use `setup`, `format`, `test`, `check`, `build` and `all` as direct commands. The build requires Node.js 18+, a supported local game installation and a legitimately downloaded `zmore_survival_items_P.pak` in the game's `Remnant/Content/Paks` directory.

See [Development](docs/development.md) and [Technical design](docs/technical.md) for details.

## Survival vendor credit and reuse

The expanded inventory is derived locally from [Survival vendor tweaks v0.5](https://www.nexusmods.com/remnantfromtheashes/mods/86), created by **ACan** and uploaded to Nexus Mods by **acanthan**. The original page provides no additional permission notes, and no public GitHub repository attributable to that mod was found during the September 2026 search.

The repository therefore contains the integration code, attribution and tests, but not the author's original PAK or extracted assets. A local build reads the user's own copy and produces the combined PAK. Do not publish that generated PAK on GitHub Releases, Nexus Mods or elsewhere without written permission from ACan. See the [publishing checklist](docs/publishing.md).

## License

Original source code and documentation in this repository are available under the [MIT License](LICENSE). That license does not cover Remnant game files, ACan's Survival vendor assets or any other third-party content.
