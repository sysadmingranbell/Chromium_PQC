// Copyright (c) 2026 Silva Rosa Corporation (DE USA 6615106).
// Pure status classification shared by the UI prototype and its tests.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ChromiumPqcAddressState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PQC_PRESENTATION = Object.freeze({
    pqc_certificate: Object.freeze({
      colour: 'blue',
      label: 'PQC certificate',
      explanation: 'A validated PQC digital certificate is in use.'
    }),
    hybrid_key_exchange: Object.freeze({
      colour: 'green',
      label: 'Hybrid key exchange',
      explanation: 'The active TLS session negotiated a hybrid key exchange.'
    }),
    classical_tls: Object.freeze({
      colour: 'yellow',
      label: 'Classical TLS',
      explanation: 'TLS is active; no PQC certificate or hybrid key exchange was detected.'
    }),
    unencrypted: Object.freeze({
      colour: 'red',
      label: 'No encryption',
      explanation: 'The active page connection is not encrypted.'
    }),
    untrusted_tls: Object.freeze({
      colour: 'neutral',
      label: 'TLS authentication failed',
      explanation: 'TLS may encrypt traffic, but the browser could not authenticate it. Keep Chromium’s native security warning visible.'
    }),
    unknown: Object.freeze({
      colour: 'neutral',
      label: 'Status unavailable',
      explanation: 'The browser has not received enough verified connection data to classify this page.'
    })
  });

  const QDFS_PRESENTATION = Object.freeze({
    qdfs_ipv6_ca: Object.freeze({
      colour: 'blue',
      label: 'QDFS · IPv6 · QDFS CA validated'
    }),
    qdfs_ipv4_ca: Object.freeze({
      colour: 'green',
      label: 'QDFS · IPv4 · QDFS CA validated'
    }),
    qdfs_without_ca: Object.freeze({
      colour: 'yellow',
      label: 'QDFS peer · QDFS CA not validated'
    }),
    outside_qdfs: Object.freeze({
      colour: 'gray',
      label: 'Outside the QDFS network'
    }),
    unknown: Object.freeze({
      colour: 'neutral',
      label: 'QDFS status unavailable'
    })
  });

  function classifyPqc(connection) {
    if (!connection || typeof connection.tlsActive !== 'boolean') {
      return { state: 'unknown', ...PQC_PRESENTATION.unknown };
    }
    if (!connection.tlsActive) {
      return { state: 'unencrypted', ...PQC_PRESENTATION.unencrypted };
    }
    if (connection.tlsAuthenticated === false) {
      return { state: 'untrusted_tls', ...PQC_PRESENTATION.untrusted_tls };
    }
    if (connection.tlsAuthenticated !== true) {
      return { state: 'unknown', ...PQC_PRESENTATION.unknown };
    }
    // A validated PQC certificate takes the requested blue precedence; details
    // must still report a hybrid key exchange if both properties are present.
    if (connection.pqcCertificateValidated === true) {
      return { state: 'pqc_certificate', ...PQC_PRESENTATION.pqc_certificate };
    }
    if (connection.hybridKeyExchange === true) {
      return { state: 'hybrid_key_exchange', ...PQC_PRESENTATION.hybrid_key_exchange };
    }
    return { state: 'classical_tls', ...PQC_PRESENTATION.classical_tls };
  }

  function classifyQdfs(network) {
    if (!network || !['member', 'outside'].includes(network.membership)) {
      return { state: 'unknown', ...QDFS_PRESENTATION.unknown };
    }
    if (network.membership === 'outside') {
      return { state: 'outside_qdfs', ...QDFS_PRESENTATION.outside_qdfs };
    }
    if (network.qdfsCaValidated !== true) {
      return { state: 'qdfs_without_ca', ...QDFS_PRESENTATION.qdfs_without_ca };
    }
    if (network.ipFamily === 'ipv6') {
      return { state: 'qdfs_ipv6_ca', ...QDFS_PRESENTATION.qdfs_ipv6_ca };
    }
    if (network.ipFamily === 'ipv4') {
      return { state: 'qdfs_ipv4_ca', ...QDFS_PRESENTATION.qdfs_ipv4_ca };
    }
    return { state: 'unknown', ...QDFS_PRESENTATION.unknown };
  }

  function canShowCertificate(certificate) {
    return Boolean(certificate && certificate.der && certificate.subject);
  }

  return Object.freeze({
    PQC_PRESENTATION,
    QDFS_PRESENTATION,
    classifyPqc,
    classifyQdfs,
    canShowCertificate
  });
});
