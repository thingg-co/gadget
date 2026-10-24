# Firmware

Not started. Planned stack, see `../docs/architecture.md`:

- Zephyr RTOS via the nRF Connect SDK
- OpenThread for the 802.15.4 data plane
- Semtech SX1262 driver, adapted
- Custom SDN control plane over LoRa
- BLE with 20 concurrent connections
- Bitcoin signing wallet (secp256k1)

Target board: `hardware/` rev A once the schematic and layout exist.
