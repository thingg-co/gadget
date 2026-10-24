# Hardware

Rev A schematic in progress. KiCad 7.0.11.

## Schematic status

The schematic (`gadget.kicad_sch`) currently holds only the title block. The
plan, in build order:

1. Power tree: USB-C + BQ25185 charger, battery, TPS62740 3.3 V buck.
2. MCU: nRF54L15 with decoupling, SWD, buttons, buzzer, LED.
3. Radios: two SX1262 with matching networks and antennas.
4. Display and GPS: e-ink FPC, AT6558 module.

## Symbol library

`symbols/` holds converted library symbols to embed into the schematic:

- `nrf54l15.kicad_sym` - NRF54L15-QFAA-R, four units, 49 pins.
- `sx1262.kicad_sym` - SX1262IMLTRT, QFN24, 25 pins.

Both were converted from KiCad 10 community symbols (cheyao/nrf54l15-discovery
and the official KiCad RF library) to the KiCad 7.0.11 format:

- Removed `exclude_from_sim`, `in_pos_files`, `duplicate_pin_numbers_are_jumpers`,
  `embedded_fonts`, `schematic_only` tokens.
- Removed `(show_name no)` and `(do_not_autoplace no)` from fields.
- Moved `(hide yes)` to bare `hide` inside effects, and in pins to a bare
  `hide` token in the pin body.

The KiCad 10 file format does not load in KiCad 7.0.11. Validation is
`kicad-cli sch export svg <file> -o <out>`; any valid schematic must export.

## Still needed

- BQ25185, TPS62740, USB-C, e-ink connector, AT6558 symbols (custom or
  community, converted to v7).
- Schematic layout and wiring.
- Footprints and PCB layout.
