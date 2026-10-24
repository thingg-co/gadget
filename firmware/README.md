# Firmware

Zephyr RTOS via the nRF Connect SDK (NCS). The planned stack:

- OpenThread for the 802.15.4 data plane
- Semtech SX1262 driver for the LoRa control plane
- Custom SDN control plane over LoRa
- BLE with 20 concurrent connections
- Bitcoin signing wallet (secp256k1)

See `../docs/architecture.md` for the design.

## Status

Scaffold compiles for the rev A board: hello world on the nRF54L15 with the
debug console on UART20 and LoRa radio #1 wired to SPI0. The board target
`gadget/nrf54l15/cpuapp` is defined in `app/boards/gadget/`. Pins in
`gadget-pinctrl.dtsi` are provisional until the schematic is finished.

## Toolchain

NCS v3.3.4 (Zephyr 4.3.99) on Linux aarch64:

- west workspace: `west init -m https://github.com/nrfconnect/sdk-nrf --mr v3.3.4 <dir>`
  then `west update`. The nRF repo moved from `nordicsemi/nrf`; the
  `nrfconnect/sdk-nrf` URL is current.
- Python env: `python3 -m venv ~/.venvs/ncs && ~/.venvs/ncs/bin/pip install west`
  plus Zephyr's `scripts/requirements.txt`, and `ninja`.
- Zephyr SDK 0.16.x, arm-zephyr-eabi, at `~/zephyr-sdk-0.16.9`. NCS v3.3.4
  requires SDK 0.16; SDK 1.0.x is incompatible with it.
- `dtc` from the system package (`device-tree-compiler`).

## Building

From the west workspace root:

```sh
BOARD_ROOT=/path/to/gadget/firmware/app \
  west build -b gadget/nrf54l15/cpuapp -d build \
  -s /path/to/gadget/firmware/app
```

`BOARD_ROOT` points at the app directory, which carries the board target
under `app/boards/gadget/`. Set `ZEPHYR_SDK_INSTALL_DIR` if the SDK is not
in a default location. Output lands in `build/app/zephyr/zephyr.elf` with a
merged `build/merged.hex` for the nRF54L15.

## Board map (rev A provisional)

| Function | Interface | Pins |
|---|---|---|
| Debug console | UART20 | TX P1.04, RX P1.05 |
| SX1262 #1 | SPI0 + 4 GPIO | SCK P2.01, MOSI P2.02, MISO P2.04, CS P2.05, RST P2.00, DIO1 P2.07, BUSY P2.06 |
