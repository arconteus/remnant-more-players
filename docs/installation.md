# Installation and usage

## Epic Games host

Copy the generated `dist/Remnant` directory over the game's `Remnant` directory. The expected result is:

```text
Remnant/Content/Paks/zzzz_FivePlayers_Experimental_P.pak
Remnant/Content/Paks/FivePlayers/ndc_Jugar-Remnant.vbs
Remnant/Content/Paks/FivePlayers/ndc_Activar-5-Jugadores.ps1
Remnant/Content/Paks/FivePlayers/ndc_Activar-5-Jugadores.cmd
```

Close Remnant before replacing files. Remove or rename older four-player PAKs so they cannot override this version.

For every play session, double-click `ndc_Jugar-Remnant.vbs`. It asks Epic Games Launcher to start the installed copy, waits for the game process and applies the session patch without showing a console. Create a new multiplayer session only after the success notification appears.

`ndc_Activar-5-Jugadores.cmd` remains available as a manual fallback. Run it first, start the game through Epic, wait for the success message and then create the session.

## Guests

Guests install `zzzz_FivePlayers_Experimental_P.pak` in `Remnant/Content/Paks`. The current memory helper is needed by the host. Steam guests worked in the earlier four-player test, but five-player mixed-store play has not yet been confirmed.

## Uninstall

Close the game and remove the five-player PAK and the `FivePlayers` helper directory. The helper does not install a service or permanently modify the executable. Its memory change disappears when the game closes.
