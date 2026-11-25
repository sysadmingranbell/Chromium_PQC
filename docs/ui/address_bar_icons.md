# OnRouteWay address-bar indicators — implementation contract

**Product:** OnRouteWay
**Creator attribution:** Created by Silva Rosa Corporation for Granbell Financial Services.
**Copyright:** © 2026 Silva Rosa Corporation (DE USA 6615106)
**Status:** UI requirements and state-classification prototype. Native Chromium integration is not yet present because `source/` contains no Chromium checkout.

## Display

Show two compact, keyboard-accessible controls beside the active tab's origin in the address bar, in this order: **[PQC] [QDFS]**. Each control must have a visible text label, a state colour, a tooltip, and an accessible name; colour must never be the only status cue. The state belongs to the active tab for PQC and to the QDFS connection associated with the active tab for QDFS. Recompute on navigation, TLS connection updates, tab switch, and QDFS peer-state updates.

## PQC indicator

| State | Colour | Required evidence |
|---|---|---|
| Validated PQC certificate | Blue | The active connection is authenticated and its presented certificate chain has a PQC certificate/signature validated by Chromium. |
| Hybrid key exchange | Green | TLS is authenticated and the actual negotiated key-exchange group is hybrid. Do not infer this from the certificate algorithm. |
| Classical TLS | Yellow | Authenticated TLS is active, with neither a validated PQC certificate nor a hybrid negotiated key exchange. |
| No encryption | Red | The active page connection has no TLS encryption. |
| Authentication failed / state unavailable | Neutral extension state plus Chromium's existing warning UI | Never describe invalid or unknown TLS as "classical TLS" or "no encryption". Preserve Chromium's blocking/interstitial warnings. |

If both a validated PQC certificate and a hybrid key exchange are present, show blue as requested and list both facts in the details. Keep certificate signature/key type separate from the negotiated TLS key-exchange group.

### PQC details panel

On activation, show the state in words; origin; TLS version; certificate-chain validation result; certificate subject, issuer, validity and signature/public-key algorithm when actually available; negotiated key-exchange group; and whether the connection is encrypted. Do not synthesize or infer missing fields. Provide **View certificate** only when the active connection exposes a real certificate; use Chromium's certificate-viewer path. The prototype has no live certificate and therefore disables this action. The repository's current `ca/ca.pem` identifies its subject and issuer as `CN=QDFS Peer CA ML-DSA-65,OU=QDFS Peer CA,O=Granbell UK,C=GB`; do not relabel that certificate as issued by Silva Rosa Corporation or Delaware. Display the certificate's actual metadata when viewing it.

## QDFS indicator

| State | Colour | Required evidence |
|---|---|---|
| QDFS peer, QDFS CA validated, IPv6 | Blue | Verified QDFS peer/network membership, successful validation to the configured QDFS CA, and an observed IPv6 route. |
| QDFS peer, QDFS CA validated, IPv4 | Green | Verified QDFS peer/network membership, successful validation to the configured QDFS CA, and an observed IPv4 route. |
| QDFS peer, QDFS CA not validated | Yellow | Positive QDFS peer/network-membership evidence, but the configured QDFS CA is absent, untrusted, or not validated; any IP family. |
| Outside QDFS | Grey | The connection is verified not to be a QDFS peer / no QDFS membership. |
| State unavailable | Neutral extension state | The network service has not provided enough evidence. Do not claim "outside QDFS" from missing data alone. |

Do not determine QDFS membership from a hostname, IP prefix, or CA presence alone. Use authenticated peer identity/membership from the QDFS network integration. Show the IP family, membership evidence, CA-validation result and peer status in the details. Reveal a full peer address only on explicit user action.

### QDFS details panel

Show QDFS membership/peer status, IP family, QDFS CA validation result and certificate metadata when available. Add a certificate-viewer action only when the QDFS connection provides a real certificate. Do not claim that the browser is connected to IPFS/QDFS until a live peer-state provider exists.

## Help and branding

Use **OnRouteWay** as the product name and always show **“Created by Silva Rosa Corporation for Granbell Financial Services.”** on product-owned About/Help surfaces, alongside the copyright string above. Do not globally replace upstream Chromium/Google names in third-party links, legal notices, source identifiers, or service names; that can break functionality and misrepresent upstream components.

### What is PQC?

Post-quantum cryptography (PQC) is cryptography designed to resist attacks by quantum computers as well as classical computers. No algorithm can be described as absolutely secure against every future attack. ML-DSA-65 is a digital-signature algorithm standardised in NIST FIPS 204; it is distinct from a TLS key-exchange algorithm. The indicator reports properties verified for the current connection, not a general guarantee about the website.

### What is the QDFS network?

QDFS is Silva Rosa Corporation's distributed network using IPFS peer connectivity. The QDFS indicator reports only verified peer membership, the network path's IP family and whether the QDFS CA validated the relevant certificate. An IPFS installation by itself does not prove QDFS membership.

## Native integration plan and verification constraints

- Add two native address-bar controls in Chromium's desktop location-bar UI, with state sourced from the active tab's verified security state and a dedicated QDFS peer-status service.
- Reuse native security/page-info and certificate-viewer surfaces rather than displaying certificates copied into the web page.
- Use Chromium's current location-bar/security-state components as extension points. The official `LocationBarModelImpl` reads security state from its delegate and the desktop `LocationBarView` owns the location-bar UI: <https://chromium.googlesource.com/chromium/src/+/HEAD/components/omnibox/browser/location_bar_model_impl.cc> and <https://chromium.googlesource.com/chromium/src/+/HEAD/chrome/browser/ui/views/location_bar/location_bar_view.cc>.
- Chromium's origin-information guidance calls for showing the authenticated/confidential state and providing a control to view the certificate chain when authenticated: <https://www.chromium.org/Home/chromium-security/enamel/goals-for-the-origin-info-bubble/>.
- `source/` currently contains no tracked files or Chromium checkout. Therefore no native C++/GN integration, build, or cross-platform verification is claimed by this contract or the accompanying demo.

## Prototype files

- `address_bar_demo.html` — interactive, explicitly simulated visual prototype.
- `address_bar_state.js` — pure classification functions for the specified status/evidence mapping.
- `address_bar_state_test.js` — Node.js assertions for mapping precedence and certificate availability.
