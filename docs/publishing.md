# Publishing checklist

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Technical](https://img.shields.io/badge/previous-technical-555555)](technical.md)

Include `.github/`, `docs/`, `runtime/`, `src/`, `.gitignore`, `LICENSE`, `THIRD_PARTY_NOTICES.md`, `package.json` and `README.md` in GitHub.

Do not publish `private/`, `reports/` or the whole local project directory. They can contain extracted game assets, binary research and machine-specific output. `dist/` is ignored by Git and intended for a reviewed release archive.

Before publishing a release:

1. Build and test against the supported game version.
2. Review `reports/build-report.json`.
3. Package the contents of `dist`, preserving its directory structure.
4. State both supported executable hashes and the store-specific behavior.
5. Describe five-player support and travel behavior as experimental until tested.
6. Explain that the helper changes one verified byte in the running process and does not alter the executable on disk.
7. Credit **ACan** (Nexus uploader **acanthan**) and link the original [Survival vendor tweaks](https://www.nexusmods.com/remnantfromtheashes/mods/86).
8. Disable Nexus Mods Donation Points for every release containing the Survival vendor assets.
9. Include `README.md` and `THIRD_PARTY_NOTICES.md` in the release archive so the attribution travels with the PAK.

Suggested title: **Remnant: From the Ashes — More Players (5 players, Epic + Steam, experimental)**.

The MIT license applies to original source and documentation only. It does not relicense the Survival vendor assets or game content inside the generated PAK. ACan's displayed Nexus permissions allow publishing the modified assets and uploading them to other sites when the creator is credited; they expressly prohibit earning Nexus Mods Donation Points from a mod that uses those assets.

---

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Technical](https://img.shields.io/badge/previous-technical-555555)](technical.md)
