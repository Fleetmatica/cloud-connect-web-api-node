'use strict'

const request = require('./base-request')

const DEFAULT_HOST = 'dashboard.munic.io/api',
  DEFAULT_VERSION = 'v2',
  DEFAULT_PORT = 443,
  DEFAULT_SCHEME = 'https'

module.exports.builder = () => {
  return request.builder()
    .withVersion(DEFAULT_VERSION)
    .withHost(DEFAULT_HOST)
    .withPort(DEFAULT_PORT)
    .withScheme(DEFAULT_SCHEME)
}
