param([switch]$Comprobar, [switch]$LaunchGame, [switch]$Silent)
$ErrorActionPreference = 'Stop'
function Report-Ndc([string]$message, [bool]$failed = $false) {
    $message | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'ndc_estado.txt') -Encoding UTF8
    if ($Silent) {
        $popup = New-Object -ComObject WScript.Shell
        $seconds = 3
        $icon = 64
        if ($failed) { $seconds = 0; $icon = 16 }
        [void]$popup.Popup($message, $seconds, 'ndc More Players', $icon)
    } else { Write-Host $message }
}
try {
    $exe = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../Binaries/Win64/Remnant-Win64-Shipping.exe'))
    $expectedHash = '078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f'
    if ((Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash -ne $expectedHash) { throw 'Version distinta del juego. No se aplicara ningun parche.' }
    $pak = Join-Path $PSScriptRoot '../zzzz_FivePlayers_Experimental_P.pak'
    if ((Get-FileHash -LiteralPath $pak -Algorithm SHA256).Hash -ne '__PAK_SHA256__') { throw 'El paquete PAK falta o ha cambiado.' }
    if ($LaunchGame) {
        $installRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..')).TrimEnd('\')
        $manifestFolder = Join-Path $env:ProgramData 'Epic/EpicGamesLauncher/Data/Manifests'
        $matches = @(Get-ChildItem -LiteralPath $manifestFolder -Filter '*.item' | ForEach-Object {
            try {
                $m = Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json
                if ($m.InstallLocation -and [IO.Path]::GetFullPath($m.InstallLocation).TrimEnd('\') -eq $installRoot) { $m }
            } catch { }
        })
        if ($matches.Count -ne 1 -or -not $matches[0].AppName) { throw 'No se encontro una instalacion unica de Remnant en Epic. Abre Epic y verifica la instalacion.' }
        $m = $matches[0]
        $appId = $m.AppName
        if ($m.CatalogNamespace -and $m.CatalogItemId) { $appId = $m.CatalogNamespace + ':' + $m.CatalogItemId + ':' + $m.AppName }
        $launchUri = 'com.epicgames.launcher://apps/' + [Uri]::EscapeDataString($appId) + '?action=launch&silent=true'
    }
    if ($Comprobar) { Write-Host 'OK: ejecutable, PAK y configuracion de lanzamiento verificados.'; exit 0 }
    Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class FivePlayersMemory {
 [DllImport("kernel32.dll", SetLastError=true)] public static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
 [DllImport("kernel32.dll", SetLastError=true)] public static extern bool ReadProcessMemory(IntPtr h, IntPtr a, byte[] b, UIntPtr n, out UIntPtr read);
 [DllImport("kernel32.dll", SetLastError=true)] public static extern bool WriteProcessMemory(IntPtr h, IntPtr a, byte[] b, UIntPtr n, out UIntPtr written);
 [DllImport("kernel32.dll", SetLastError=true)] public static extern bool VirtualProtectEx(IntPtr h, IntPtr a, UIntPtr n, uint protection, out uint old);
 [DllImport("kernel32.dll", SetLastError=true)] public static extern bool FlushInstructionCache(IntPtr h, IntPtr a, UIntPtr n);
 [DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr h);
}
'@
    if ($LaunchGame) {
        $existing = Get-Process -Name 'Remnant-Win64-Shipping' -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $exe }
        if (-not $existing) { Start-Process -FilePath $launchUri -WindowStyle Hidden | Out-Null }
    }
    Write-Host 'Abre Remnant desde Epic y espera en el menu principal. No crees la partida todavia.'
    $deadline = (Get-Date).AddMinutes(3)
    $game = $null
    while ((Get-Date) -lt $deadline) {
        $game = Get-Process -Name 'Remnant-Win64-Shipping' -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $exe } | Select-Object -First 1
        if ($game) { break }
        Start-Sleep -Milliseconds 500
    }
    if (-not $game) { throw 'No se encontro el juego en tres minutos. Vuelve a ejecutar este ayudante.' }
    $address = [IntPtr]($game.MainModule.BaseAddress.ToInt64() + 0x59A639)
    $handle = [FivePlayersMemory]::OpenProcess(0x438, $false, $game.Id)
    if ($handle -eq [IntPtr]::Zero) { throw 'No se pudo abrir el proceso. Ejecuta juego y ayudante con el mismo nivel de permisos.' }
    try {
        $bytes = New-Object byte[] 7
        $count = [UIntPtr]::Zero
        if (-not [FivePlayersMemory]::ReadProcessMemory($handle, $address, $bytes, ([UIntPtr]::new([uint32]7)), [ref]$count) -or $count.ToUInt64() -ne 7) { throw 'No se pudo leer la instruccion.' }
        $hex = [BitConverter]::ToString($bytes)
        if ($hex -eq 'C7-40-08-05-00-00-00') { Report-Ndc 'Mod de 5 jugadores activo. Puedes crear una partida nueva.'; exit 0 }
        if ($hex -ne 'C7-40-08-03-00-00-00') { throw "Bytes inesperados: $hex. No se modifico el proceso." }
        $target = [IntPtr]($address.ToInt64() + 3)
        $old = [uint32]0
        if (-not [FivePlayersMemory]::VirtualProtectEx($handle, $target, ([UIntPtr]::new([uint32]1)), 0x40, [ref]$old)) { throw 'No se pudo habilitar la escritura temporal.' }
        try {
            $one = [byte[]]@(5)
            if (-not [FivePlayersMemory]::WriteProcessMemory($handle, $target, $one, ([UIntPtr]::new([uint32]1)), [ref]$count) -or $count.ToUInt64() -ne 1) { throw 'No se pudo escribir el limite.' }
            if (-not [FivePlayersMemory]::FlushInstructionCache($handle, $target, ([UIntPtr]::new([uint32]1)))) { throw 'Fallo al actualizar la cache de instrucciones. Cierra el juego y vuelve a intentar.' }
        } finally {
            $ignored = [uint32]0
            if (-not [FivePlayersMemory]::VirtualProtectEx($handle, $target, ([UIntPtr]::new([uint32]1)), $old, [ref]$ignored)) { throw 'Fallo al restaurar la proteccion. Cierra el juego.' }
        }
        if (-not [FivePlayersMemory]::ReadProcessMemory($handle, $address, $bytes, ([UIntPtr]::new([uint32]7)), [ref]$count) -or [BitConverter]::ToString($bytes) -ne 'C7-40-08-05-00-00-00') { throw 'No se pudo verificar el parche. Cierra el juego.' }
        Write-Host 'OK: capacidad de creacion de sala cambiada de 3 a 5 en memoria.'
        Write-Host 'Ahora crea una NUEVA partida. Si ya tenias una, vuelve al menu y creala otra vez.'
        Write-Host 'Experimental: falta verificar ingreso del quinto jugador y viajes. Repetir tras cada inicio del juego.'
        Report-Ndc 'Mod de 5 jugadores activo. Puedes crear una partida nueva.'
    } finally { [void][FivePlayersMemory]::CloseHandle($handle) }
} catch {
    Report-Ndc ('ERROR: ' + $_.Exception.Message) $true
    exit 1
}

