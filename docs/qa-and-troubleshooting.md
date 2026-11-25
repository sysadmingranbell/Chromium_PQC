# OnRouteWay — QA and troubleshooting

## Current project status

- The address-bar demo is simulated; it does not read a live TLS session or QDFS peer state.
- Native Chromium integration and a packaged OnRouteWay application are pending a populated Chromium source checkout.
- Product Help and About must say: “Created by Silva Rosa Corporation for Granbell Financial Services.”

## Certificate checks

The public `ca/ca.pem` certificate identifies its subject and issuer as `CN=QDFS Peer CA ML-DSA-65,OU=QDFS Peer CA,O=Granbell UK,C=GB`. Its public-key and signature algorithms are ML-DSA-65. Display certificate identity from the certificate itself; do not replace its issuer/organisation with product branding.

## Indicator safety rules

- A PQC certificate signature/public-key and a hybrid TLS key exchange are different connection properties.
- Keep invalid/untrusted TLS distinct from classical TLS and from an unencrypted connection.
- Report QDFS only from verified peer/network-membership evidence; IPFS alone is not proof of QDFS membership.
- Enable certificate viewing only when a real certificate from the active connection is available.

## Prototype tests

Run the status-classification assertions with Node.js:

```text
node docs/ui/address_bar_state_test.js
```

This checks classification logic only. It does not test native Chromium UI, network integration, or platform packaging.
