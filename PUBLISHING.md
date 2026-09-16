# Publication preparation

For a source repository, include only `src/`, `runtime/`, `package.json`, `.gitignore`, `README.md`, `LICENSE` and this document. The project's original code and documentation are licensed under MIT. Do not apply that license to the game's assets.

`private/` contains extracted game assets, binary snippets and historical investigation. `dist/` contains locally generated install files. Both are excluded by `.gitignore`; do not upload the whole project directory using a browser without reviewing its contents.

After building and testing, `dist/` has the directory layout needed for a local install or a release ZIP. Review the game's/modding content distribution permissions before publishing the generated PAK, which contains a modified game configuration file. The original executable, PDB and original game PAKs are not included in this output.

Suggested release title: Remnant From the Ashes — Five Players (Epic host, experimental).

State the exact executable restriction, requirement to start the game using ndc_Jugar-Remnant.vbs (hidden automatic helper; CMD fallback), reported mixed-platform success with the previous four-player version and untested five-player support, and unverified travel behavior in the GitHub/Nexus description. Explain that the helper writes one byte in the running game and is included as readable source. Do not describe it as universal Steam support or a complete Survival fix.

No GitHub repository, Nexus listing or public release has been created by this preparation.


