# Hardware specification

Revision A. Handset and home base station share one core design.

## Block diagram (handset)

```
                     +-----------------------------+
   915 MHz LoRa #1  <-> SX1262 #1 <--SPI0--+       |
   915 MHz LoRa #2  <-> SX1262 #2 <--SPI1--+-- nRF54L15 --+
   2.4 GHz mesh     <-> on-chip radio      |  (Cortex-M33) |
   e-ink display    <-> e-ink driver <--SPI2--+            |
   GPS              <-> AT6558 <--UART0------+            |
   buttons/LED/buzz <- GPIO                  |            |
   battery          <- charger <--USB-C     |            |
                     +----------------------+------------+
```

## Handset BOM (rev A, prototype quantities)

| Item | Part | Qty | Unit price | Total |
|---|---|---|---|---|
| SoC | Nordic nRF54L15 (QFN48) | 1 | $4 | $4 |
| LoRa radio | Semtech SX1262 | 2 | $2 | $4 |
| Display | 4.2" e-ink, 400x300, SPI | 1 | $13 | $13 |
| GPS | AT6558 module | 1 | $3 | $3 |
| Battery | 3000 mAh LiPo pouch | 1 | $5 | $5 |
| Charger | BQ25185 + protection | 1 | $2 | $2 |
| Power | TPS62740 buck to 3.3 V | 1 | $2 | $2 |
| Buttons | tactile, 5x | 5 | $0.20 | $1 |
| Buzzer | 5 V piezo | 1 | $0.30 | $0.30 |
| Antennas | 915 MHz PCB trace + 2.4 GHz chip | 2 | $0.50 | $1 |
| USB-C | connector + ESD | 1 | $1 | $1 |
| Passives | caps, resistors, inductors | ~120 | - | $8 |
| PCB | 4-layer, prototyped | 1 | $8 | $8 |
| **Total** | | | | **~$52** |

## Home base station BOM

| Item | Part | Qty | Unit price | Total |
|---|---|---|---|---|
| SoC | Nordic nRF54L15 (QFN48) | 1 | $4 | $4 |
| Concentrator | Semtech SX1303 + 2x SX1257 | 1 | $14 | $14 |
| Ethernet | W5500 + RJ45/magnetics | 1 | $5 | $5 |
| Antenna | 915 MHz SMA 5 dBi, external | 1 | $4 | $4 |
| Power | USB-C 5 V charger + regulator | 1 | $4 | $4 |
| Enclosure | printed slab | 1 | $4 | $4 |
| Misc | LEDs, passives, PCB | - | $15 | $15 |
| **Total** | | | | **~$50** |

## Power budget (handset, estimates to verify on rev A)

| State | Current | Battery life (3000 mAh) |
|---|---|---|
| Deep sleep, radios off | ~5 uA | years (self-discharge bound) |
| Standby, 0.1% listen duty | ~20 uA | months to years |
| Active mesh, 1% duty | ~0.5-1 mA | 4-12 months |
| Heavy use | 10-30 mA | 4-12 days |

LoRa TX bursts are ~120 mA but last milliseconds at low duty. The e-ink
draws nothing when static; it only draws during a refresh.

## Pin map (functions; exact pins from datasheet, QFN48)

| Function | Interface | Notes |
|---|---|---|
| SX1262 #1 | SPI0 + 4 GPIO (CS, DIO1, RST, BUSY) | control plane, 915 MHz |
| SX1262 #2 | SPI1 + 4 GPIO | second channel, 915 MHz |
| e-ink | SPI2 + 3 GPIO (DC, RST, BUSY) | 4.2", 400x300 |
| GPS | UART0 + PPS GPIO | AT6558, on-demand power |
| Buttons | 5x GPIO | up, down, select, back, power |
| Buzzer | GPIO PWM | alerts |
| LED | GPIO | status |
| Battery | ADC via divider | fuel gauge |
| Charger | I2C0 | BQ25185 status |
| Debug | SWDIO, SWCLK | pogo pads |
| Radio | RF pins | 2.4 GHz antenna on-chip path |

## Frequency plan

- LoRa #1: 915.0 MHz, SF10/125 kHz default. Long-range control plane.
- LoRa #2: 915.5 MHz, SF8/500 kHz for data bursts. Frequency-diverse.
- 802.15.4: 2.4 GHz, channels 11-26. Mesh data plane.
- BLE 5.4: 40 channels, up to 20 concurrent connections.
- Band plans: 868 MHz EU (1% duty cycle enforced in firmware), 920-925 MHz
  Thailand. Antenna matching is per band; rev A targets 915 MHz.

## Regulatory notes

- FCC Part 15.247 for 902-928 MHz, +22 dBm max.
- ETSI 1% duty cycle for EU 868.
- Certification is a real product cost; rev A is a prototype.

## Fabrication targets

- 4-layer PCB, 1.6 mm, ENIG.
- Handset board ~70 x 120 mm phone slab. Case is a simple printed slab.
- Base station board ~80 x 80 mm.
