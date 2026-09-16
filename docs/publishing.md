# Publishing checklist

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Technical](https://img.shields.io/badge/previous-technical-555555)](technical.md)

Include `.github/`, `docs/`, `runtime/`, `src/`, `.gitignore`, `LICENSE`, `package.json` and `README.md` in GitHub.

Do not publish `private/`, `reports/` or the whole local project directory. They can contain extracted game assets, binary research and machine-specific output. `dist/` is ignored by Git and intended for a reviewed release archive.

Before publishing a release:

1. Build and test against the supported game version.
2. Review `reports/build-report.json`.
3. Package the contents of `dist`, preserving its directory structure.
4. State both supported executable hashes and the store-specific behavior.
5. Describe five-player support and travel behavior as experimental until tested.
6. Explain that the helper changes one verified byte in the running process and does not alter the executable on disk.
7. Credit **ACan** (Nexus uploader **acanthan**) and link the original [Survival vendor tweaks](https://www.nexusmods.com/remnantfromtheashes/mods/86).
8. Obtain the author's written redistribution permission before uploading a release containing the derived Survival vendor assets.

Suggested title: **Remnant: From the Ashes — More Players (5 players, Epic + Steam, experimental)**.

The MIT license applies to original source and documentation only. The Nexus page supplies no redistribution permission and no public source repository was found, so the generated combined PAK must not be published until ACan grants permission. Users may build it locally from their own downloaded copy.

---

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Technical](https://img.shields.io/badge/previous-technical-555555)](technical.md)
