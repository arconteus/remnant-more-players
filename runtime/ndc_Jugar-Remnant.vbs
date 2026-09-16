Option Explicit
Dim shell, fso, folder, script, command, result
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
script = fso.BuildPath(folder, "ndc_Activar-5-Jugadores.ps1")
If Not fso.FileExists(script) Then
    MsgBox "Falta ndc_Activar-5-Jugadores.ps1 junto al lanzador.", 16, "ndc More Players"
    WScript.Quit 1
End If
command = "powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & script & """ -LaunchGame -Silent"
If WScript.Arguments.Named.Exists("check") Then command = command & " -Comprobar"
On Error Resume Next
result = shell.Run(command, 0, True)
If Err.Number <> 0 Then
    MsgBox "No se pudo iniciar el ayudante: " & Err.Description, 16, "ndc More Players"
    WScript.Quit 1
End If
WScript.Quit result
