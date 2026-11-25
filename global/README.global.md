# OnRouteWay — Global Project Configuration

## Product identity

- Product name: OnRouteWay
- Creator attribution: Created by Silva Rosa Corporation for Granbell Financial Services.
- Copyright: © 2026 Silva Rosa Corporation (DE USA 6615106)
- Help locale: en-GB
- Help/About configuration: `global/ui_help.en-GB.json`
- Icon assets: `branding/icons/OnRouteWay.png`, `branding/icons/OnRouteWay.ico`, and `branding/icons/OnRouteWay.icns`

## Project status

- The project workspace remains `QDFS/Chromium_PQC`; this repository/folder name is retained for continuity and is not the browser's displayed name.
- The Chromium source checkout in `source/` is currently empty (zero tracked files).
- Native browser title, About/Help integration and application-icon embedding are pending the Chromium source checkout.
- Address-bar indicators have a requirements document, simulated interactive prototype and state-classification tests in `docs/ui/`.

## Verified CA metadata

The public certificate at `ca/ca.pem` identifies its subject and issuer as `CN=QDFS Peer CA ML-DSA-65,OU=QDFS Peer CA,O=Granbell UK,C=GB`, with ML-DSA-65 public-key and signature algorithms. This certificate must not be relabelled as issued by Silva Rosa Corporation or Delaware; display the actual certificate metadata.

## Public repository scope

The GitHub repository is public. Only product-owned branding, Help/About, the public CA certificates, and address-bar prototype/specification/tests belong in its initial source snapshot. Host-specific configuration, access notes, secrets, Chromium checkouts/build outputs and unvalidated native resource stubs stay out of the public repository. The private working configuration is `global/config.global.yaml` and must not be committed.

Do not commit private keys, access tokens, profiles, or NSS databases. Check that secrets are excluded before every commit.
