# Installation and usage

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Development](https://img.shields.io/badge/next-development-6f42c1)](development.md)

## Install on Epic Games or Steam

Copy the generated `dist/Remnant` directory over the game's `Remnant` directory. Typical roots are the Epic installation directory or `<Steam library>/steamapps/common/Remnant`. The expected result is:

```text
Remnant/Content/Paks/zzzz_FivePlayers_Experimental_P.pak
Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs
Remnant/Content/Paks/FivePlayers/ndc_Activar-5-Jugadores.ps1
Remnant/Content/Paks/FivePlayers/ndc_Activar-5-Jugadores.cmd
```

Close Remnant before replacing files. Remove or rename older four-player PAKs so they cannot override this version.

For every play session, double-click `ndc_Jugar-Remnant.vbs`. It identifies the store from the executable hash, launches that installed copy through Epic Games Launcher or Steam, waits for the game process and activates the matching path without showing a console. Create a new multiplayer session only after the success notification appears.

`ndc_Activar-5-Jugadores.cmd` remains available as a manual fallback. Run it first, start the same installed copy normally, wait for the success message and then create the session.

## Guests

Guests install `zzzz_FivePlayers_Experimental_P.pak` in `Remnant/Content/Paks`. Epic hosting uses the PAK plus an EOS memory patch. Steam hosting uses the PAK-configured session limit. Five-player mixed-store play has not yet been confirmed.

## Uninstall

Close the game and remove the five-player PAK and the `FivePlayers` helper directory. The helper does not install a service or permanently modify the executable. Its memory change disappears when the game closes.

---

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Development](https://img.shields.io/badge/next-development-6f42c1)](development.md)
