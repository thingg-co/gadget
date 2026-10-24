# Gadget architecture

## Mission

A phone-shaped device that costs under $100, draws microwatts when idle,
and provides communication that does not depend on any company's network.
Text and telemetry first. Photos at scale. The budget and the power budget
are the point: this has to work for everyone, everywhere, forever.

Noncommercial by license and by mission. The people who run exit nodes are
volunteers, the same people who use the mesh.

## Roles

One hardware core, three roles.

1. **Handset.** The phone. nRF54L15 + dual SX1262 + e-ink + GPS + battery.
2. **Home base station.** Same core, SX1303 16-channel concentrator instead
   of the dual SX1262, plus Ethernet. Sits on a shelf at home, plugged into
   the router. Longer range than any handset: bigger antenna, mains power.
   Runs the SDN controller and is the internet exit node for its
   neighborhood.
3. **Firmware role.** Any device can also be a plain relay. The mesh does
   not care which role a node plays.

## Network model

The mesh is SDN-shaped, with the control plane and data plane separated:

- **Control plane: LoRa.** One SX1262 channel carries topology beacons,
  route setup, key exchange, and short text messages at any range. LoRa
  reaches kilometers, so the control plane always exists.
- **Data plane: 2.4 GHz.** 802.15.4 mesh (Thread-derived, 250 kbps, 16
  channels) and Bluetooth LE 5.4 with up to 20 concurrent connections per
  node (2 Mbps per link). This is where bandwidth lives. It works when
  nodes are near each other, which in a dense city is most of the time.
- **Controller.** The home base station runs the SDN controller: topology,
  flow tables, path selection, policy (who may use the internet, rate
  limits), DNS, NAT, and caching. The controller talks to handsets over
  the LoRa control plane and installs flows on the 2.4 GHz data plane.

The second SX1262 gives every node two simultaneous LoRa channels. That is
frequency-diversity multipath on the control plane. On the data plane,
multipath is concurrent connections (a node relays through 20 neighbors at
once) plus concurrent multipath routing: the controller installs disjoint
paths and the transport layer uses them all. This is what turns device
density into bandwidth. The ceiling is spectrum, not device count, and the
honest number is single-digit Mbps per square mile at 1% adoption.

## Internet and exit nodes

Internet access is a mesh feature, not a radio feature. Home base stations
are exit nodes. A device with no path to the internet relays through the
mesh to the nearest exit node, and that node's own home connection
backhauls the traffic.

Paranoid users run their own exit node. Traffic is end-to-end encrypted by
default, so an exit node sees ciphertext and routing headers, nothing more.

Caveats, stated plainly:

- An exit node operator legally relays other people's traffic. This is the
  Tor exit node problem and it applies here.
- Exit node bandwidth is donated. The SDN controller must rate-limit and
  cache to keep that donation cheap.

## Content and payments

Content is addressed by hash and priced in satoshis. Content can be an
article, a map tile, a firmware update, a sensor report, anything that
fits the mesh.

The payment model is a signing wallet, not a node:

- The handset holds Bitcoin keys in secure storage and signs locally. It
  never runs a Lightning node; it cannot, on this hardware.
- The home base station runs LND or Core Lightning and settles payments.
- Flow: request content by hash, get an invoice, sign it on-device, send
  it over the mesh, the exit node settles, the content decrypts.

Honest constraints:

- Lightning needs channel liquidity. Someone funds channels. For a
  nonprofit system this is the hardest operational question, not a
  technical one.
- Async and offline payments (BOLT12) are still maturing. Prototype with
  online invoices first.
- Running payment rails has legal exposure in most jurisdictions. The
  software should make exit nodes as thin as possible: they settle, they
  do not custody.

## Security and privacy

- End-to-end encryption on every mesh hop by default. Public-key mesh
  identity, keys on device.
- nRF54L15 TrustZone and hardware crypto with side-channel protection.
- Payments sign on device; private keys never leave the device.
- No telemetry, no phone-home, no kill switch. The network is the people.

## Regulatory reality

- ISM bands: 915 MHz (US), 868 MHz (EU), 920-925 MHz (Thailand). The
  SX1262 covers all; the antenna matching network is band-specific.
- EU 868 MHz enforces a 1% duty cycle per channel. Firmware must respect
  it per band.
- A real product needs FCC/CE certification. Prototypes do not. This is a
  known cost and a known schedule risk.

## Open problems

1. Concurrent multipath routing over lossy low-power links is research.
   Start with single-path RPL plus controller-assisted path diversity.
2. Mesh-scale key distribution. Start with QR pairing at a trusted base
   station.
3. Content incentives without a company. Open question, deliberately.
4. Certification cost for a $100 device. Open question.
