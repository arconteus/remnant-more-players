# Technical design

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Development](https://img.shields.io/badge/previous-development-6f42c1)](development.md)
[![Publishing](https://img.shields.io/badge/next-publishing-2da44e)](publishing.md)

The PAK changes `[/Script/Engine.GameSession] MaxPlayers` from 3 to 5. The tested executable also assigns a capacity of three inside `UMatchmaker::CreateSession`, so changing only the configuration does not reliably open additional session slots.

The helper validates the executable SHA256, PAK SHA256, process path and expected instruction bytes. It changes the immediate value in the running process from three to five, restores the page protection and reads the instruction back for verification. It never writes to the executable file.

Verified executable SHA256 values:

```text
Epic Games: 078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f
Steam:     05c2d85e6c26f7d9aab5d90979f0b487283e180303422f05a7cc3bfa1f13be4c
```

The Epic EOS build needs a memory patch at RVA `0x59A639`:

```text
C7 40 08 03 00 00 00  ->  C7 40 08 05 00 00 00
```

## Current limitations

- Five-player gameplay has not yet been confirmed by a complete group.
- Steam uses the PAK-configured session limit; its supported executable hash is checked before launch.
- Doors and zone travel are not explicitly patched.
- Survival shops require the separate compatibility patch.
- Game updates change the executable hash and are rejected until verified.

---

[![README](https://img.shields.io/badge/%E2%86%90-main_README-555555)](../README.md)
[![Development](https://img.shields.io/badge/previous-development-6f42c1)](development.md)
[![Publishing](https://img.shields.io/badge/next-publishing-2da44e)](publishing.md)
