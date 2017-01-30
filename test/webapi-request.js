'use strict'

const WebApiRequest = require('../lib/webapi-request')
const should = require('should')

describe('Create Web Api Requests', () => {

  it('Should use default settings if none are supplied', () => {
    const request = WebApiRequest.builder().build()

    request.getHost().should.equal('dashboard.munic.io/api')
    request.getPort().should.equal(443)
    request.getVersion().should.equal('v2')
    request.getScheme().should.equal('https')
    should.not.exist(request.getHeaders())
    should.not.exist(request.getPath())
    should.not.exist(request.getQueryParameters())
    should.not.exist(request.getBodyParameters())
  })

  it('Can overwrite one of the default parameters', () => {
    const request = WebApiRequest.builder().withHost('dashboard.munic.io').withVersion('v3').build()

    request.getHost().should.equal('dashboard.munic.io')
    request.getPort().should.equal(443)
    request.getVersion().should.equal('v3')
    request.getScheme().should.equal('https')
    should.not.exist(request.getHeaders())
    should.not.exist(request.getPath())
    should.not.exist(request.getQueryParameters())
    should.not.exist(request.getBodyParameters())
  })

})