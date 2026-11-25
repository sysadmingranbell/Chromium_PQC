# OnRouteWay

- Product name: OnRouteWay
- Creator attribution: Created by Silva Rosa Corporation for Granbell Financial Services.
- Copyright: © 2026 Silva Rosa Corporation (DE USA 6615106)

Project for a Chromium-based browser with PQC-aware connection reporting, QDFS network integration and a bundled public QDFS CA certificate. The current workspace contains project configuration and an address-bar prototype; it is **not yet an integrated or built browser**.

## Current status

- The GitHub project repository exists, but the Chromium source checkout in `source/` is empty (no tracked files).
- Native address-bar controls are not implemented in Chromium yet.
- `docs/ui/address_bar_demo.html` is an interactive simulation and does not inspect real TLS, certificates, IP addresses or QDFS peers.
- The simulator's classification logic is covered by `docs/ui/address_bar_state_test.js`.
- Windows and macOS builds are not produced by this workspace state.

## Address-bar indicator requirements

The native browser UI is specified to show **[PQC] [QDFS]** beside the active origin. The colours are driven only by verified evidence. See `docs/ui/address_bar_icons.md` for state definitions, certificate-viewer behaviour, accessibility requirements and Chromium integration points.

## Help and branding

Product-owned About and Help surfaces use the name **OnRouteWay** and always state: **“Created by Silva Rosa Corporation for Granbell Financial Services.”** The en-GB help copy explaining PQC and QDFS is in `global/ui_help.en-GB.json`. Keep upstream legal notices, source identifiers and external service names intact.

## Certificate metadata

The public `ca/ca.pem` certificate reports subject and issuer `CN=QDFS Peer CA ML-DSA-65,OU=QDFS Peer CA,O=Granbell UK,C=GB` and uses ML-DSA-65. Do not describe this certificate as issued by Silva Rosa Corporation or Delaware; show the actual certificate metadata in the native viewer.

## Project layout

- `source/` — intended Chromium source checkout; currently empty.
- `build/` — build configuration/output location.
- `ca/` — public CA certificate material only.
- `config/` — peer, certificate rotation and CRL settings.
- `global/` — project branding and help configuration.
- `scripts/` — certificate and CRL support scripts.
- `docs/` — project instructions and UI requirements/prototype.

Never commit private keys, tokens, profiles or NSS databases.
