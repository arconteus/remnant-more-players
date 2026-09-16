$ErrorActionPreference = 'Stop'
$script = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../runtime/ndc_Activar-5-Jugadores.ps1') -Raw
$tokens = $null
$errors = $null
[void][System.Management.Automation.Language.Parser]::ParseInput($script, [ref]$tokens, [ref]$errors)
if ($errors.Count) { throw ($errors | Out-String) }
$source = [regex]::Match($script, "(?s)Add-Type -TypeDefinition @'\r?\n(.*?)\r?\n'@").Groups[1].Value
if (-not $source) { throw 'No interop source' }
Add-Type -TypeDefinition $source
$memory = [Runtime.InteropServices.Marshal]::AllocHGlobal(7)
$handle = [FivePlayersMemory]::OpenProcess(0x438, $false, $PID)
try {
    $original = [byte[]]@(0xc7,0x40,0x08,3,0,0,0)
    [Runtime.InteropServices.Marshal]::Copy($original, 0, $memory, 7)
    $target = [IntPtr]($memory.ToInt64()+3)
    $old = [uint32]0
    $count = [UIntPtr]::Zero
    if (-not [FivePlayersMemory]::VirtualProtectEx($handle,$target,([UIntPtr]::new([uint32]1)),0x40,[ref]$old)) { throw 'Protect' }
    try {
        if (-not [FivePlayersMemory]::WriteProcessMemory($handle,$target,[byte[]]@(5),([UIntPtr]::new([uint32]1)),[ref]$count) -or $count.ToUInt64() -ne 1) { throw 'Write' }
        if (-not [FivePlayersMemory]::FlushInstructionCache($handle,$target,([UIntPtr]::new([uint32]1)))) { throw 'Flush' }
    } finally {
        $ignored = [uint32]0
        if (-not [FivePlayersMemory]::VirtualProtectEx($handle,$target,([UIntPtr]::new([uint32]1)),$old,[ref]$ignored)) { throw 'Restore' }
    }
    $read = New-Object byte[] 7
    if (-not [FivePlayersMemory]::ReadProcessMemory($handle,$memory,$read,([UIntPtr]::new([uint32]7)),[ref]$count)) { throw 'Read' }
    if ([BitConverter]::ToString($read) -ne 'C7-40-08-05-00-00-00') { throw 'Roundtrip' }
    Write-Host 'PASS: syntax, interop compilation, guarded one-byte write/read and protection restoration on private test memory. Game not launched or patched.'
} finally {
    if ($handle -ne [IntPtr]::Zero) { [void][FivePlayersMemory]::CloseHandle($handle) }
    [Runtime.InteropServices.Marshal]::FreeHGlobal($memory)
}


