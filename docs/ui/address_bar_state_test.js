// Copyright (c) 2026 Silva Rosa Corporation (DE USA 6615106).
'use strict';

const assert = require('node:assert/strict');
const {
  classifyPqc,
  classifyQdfs,
  canShowCertificate
} = require('./address_bar_state.js');

const pqcCases = [
  [{ tlsActive: false }, 'unencrypted', 'red'],
  [{ tlsActive: true, tlsAuthenticated: true, pqcCertificateValidated: true }, 'pqc_certificate', 'blue'],
  [{ tlsActive: true, tlsAuthenticated: true, hybridKeyExchange: true }, 'hybrid_key_exchange', 'green'],
  [{ tlsActive: true, tlsAuthenticated: true }, 'classical_tls', 'yellow'],
  [{ tlsActive: true, tlsAuthenticated: false, hybridKeyExchange: true }, 'untrusted_tls', 'neutral'],
  [{ tlsActive: true, tlsAuthenticated: true, pqcCertificateValidated: true, hybridKeyExchange: true }, 'pqc_certificate', 'blue'],
  [{ tlsActive: true }, 'unknown', 'neutral'],
  [null, 'unknown', 'neutral']
];
for (const [input, state, colour] of pqcCases) {
  const actual = classifyPqc(input);
  assert.equal(actual.state, state);
  assert.equal(actual.colour, colour);
}

const qdfsCases = [
  [{ membership: 'member', qdfsCaValidated: true, ipFamily: 'ipv6' }, 'qdfs_ipv6_ca', 'blue'],
  [{ membership: 'member', qdfsCaValidated: true, ipFamily: 'ipv4' }, 'qdfs_ipv4_ca', 'green'],
  [{ membership: 'member', qdfsCaValidated: false, ipFamily: 'ipv6' }, 'qdfs_without_ca', 'yellow'],
  [{ membership: 'member', qdfsCaValidated: false, ipFamily: 'ipv4' }, 'qdfs_without_ca', 'yellow'],
  [{ membership: 'outside', qdfsCaValidated: false, ipFamily: 'unknown' }, 'outside_qdfs', 'gray'],
  [{ membership: 'unknown', qdfsCaValidated: true, ipFamily: 'ipv6' }, 'unknown', 'neutral'],
  [null, 'unknown', 'neutral']
];
for (const [input, state, colour] of qdfsCases) {
  const actual = classifyQdfs(input);
  assert.equal(actual.state, state);
  assert.equal(actual.colour, colour);
}

assert.equal(canShowCertificate(null), false);
assert.equal(canShowCertificate({ subject: 'QDFS Peer CA' }), false);
assert.equal(canShowCertificate({ subject: 'QDFS Peer CA', der: Buffer.from('certificate') }), true);

console.log(`Passed ${pqcCases.length} PQC cases, ${qdfsCases.length} QDFS cases, and 3 certificate availability assertions.`);
