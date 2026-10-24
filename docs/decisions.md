# Architecture decision records

## ADR-001: ARM over RISC-V

**Status:** accepted.

**Context.** The original plan called for a RISC-V MCU. The user directed
the project to ARM: starting from zero, ARM has the best low-power radio
SoCs and the deepest ecosystem. Note the framing was backwards, ARM is the
incumbent and RISC-V the newcomer, but the decision is correct for the
hardware class.

**Decision.** Use ARM Cortex-M33-class SoCs. Selected: Nordic nRF54L15 for
the handset. (It amusingly contains a 128 MHz RISC-V coprocessor for
SoftPeripherals.)

**Consequences.** No ESP32 lineage, no Meshtastic code, nothing inherited.
Everything is clean-room.

## ADR-002: nRF54L15 as the handset SoC

**Status:** accepted.

**Context.** Need the lowest idle current in the class, 20 concurrent BLE
connections, 802.15.4, and secure storage.

**Decision.** Nordic nRF54L15 (QFN48). 128 MHz Cortex-M33, 1.5 MB NVM,
256 KB RAM, 0.7-2.9 uA sleep, 3.4 mA RX, 20 concurrent BLE links,
TrustZone, hardware crypto.

**Consequences.** No WiFi on-chip. The handset does not need WiFi; the base
station uses Ethernet. The nRF70 WiFi companion remains an option for a
future revision.

## ADR-003: Dual SX1262 for LoRa multipath

**Status:** accepted.

**Context.** One LoRa radio is one channel at a time. Two radios give two
simultaneous channels: 2x throughput, frequency diversity, and a control
plane that stays up while a data burst is on the other channel.

**Decision.** Two SX1262 radios on the handset. The base station replaces
them with one SX1303 16-channel concentrator.

**Consequences.** +$4 BOM, +2 antennas. Worth it.

## ADR-004: No Meshtastic-derived code

**Status:** accepted.

**Context.** Meshtastic is GPL-3.0 and cannot be folded into a PolyForm
project. The user directed a better version, built from zero.

**Decision.** Clean-room firmware. OpenThread (BSD) for the data plane,
Semtech's SX1262 driver, our own control plane and SDN stack.

**Consequences.** More work. No GPL anywhere, which keeps the license stack
clean.

## ADR-005: License stack

**Status:** accepted.

**Context.** The project must stay noncommercial by force of law, not just
intention.

**Decision.** Firmware: PolyForm Noncommercial 1.0.0. Hardware: CERN-OHL-NC
v1.0. Docs: CC BY-NC 4.0.

**Consequences.** Nobody can sell devices running this firmware. Ecosystem
growth is limited by the same clause. Accepted.

## ADR-006: Internet via exit nodes, no cellular

**Status:** accepted.

**Context.** The mesh must reach the internet without a cellular module,
which would blow the budget, the power budget, and the independence story.

**Decision.** Home base stations are exit nodes. Traffic egresses on the
operator's own connection, end-to-end encrypted by default.

**Consequences.** No SIM, no carrier, no certification for cellular. Exit
node operators carry legal exposure for relayed traffic.

## ADR-007: Device signs, exit node settles

**Status:** accepted.

**Context.** Lightning cannot run on an MCU. Content still needs
micropayments.

**Decision.** Handset is a hardware-wallet-style signer. The base station
runs LND or Core Lightning and settles. Content is hash-addressed and
priced in sats.

**Consequences.** Channel liquidity is an operational problem, not a
technical one. Online invoices first, BOLT12 later.

## ADR-008: E-ink and buttons, no touchscreen

**Status:** accepted.

**Context.** Power is the product. A color touchscreen is the biggest
power and cost item on any phone.

**Decision.** 4.2" e-ink, four buttons plus power. Light Phone 2 proves the
form factor.

**Consequences.** No pinch-to-zoom UI. The UI is a menu tree. Fine for
text and telemetry.
