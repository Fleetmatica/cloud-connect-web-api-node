'use strict'

const GenericError = require('../lib/generic-error')
const should = require('should')

describe('Create Generic Error', function() {

  it('should create error with message and status code', function() {
    var error = new GenericError('Something has gone wrong, ops!', 500);
    ('Something has gone wrong, ops!').should.equal(error.message);
    (500).should.equal(error.statusCode)
  })

})
