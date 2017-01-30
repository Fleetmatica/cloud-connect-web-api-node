'use strict'

var restler = require('restler'),
  GenericError = require('./generic-error')

var HttpManager = {}

/* Create restler options from the base request */
var _getParametersFromRequest = function (request) {

  var options = {}

  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters()
  }

  if (request.getHeaders() &&
    request.getHeaders()['Content-Type'] === 'application/json') {
    options.data = JSON.stringify(request.getBodyParameters())
  } else if (request.getBodyParameters()) {
    options.data = request.getBodyParameters()
  }

  if (request.getHeaders()) {
    options.headers = request.getHeaders()
  }
  return options
}

/* Create an error object from an error returned from the Web API */
var _getErrorObject = (defaultMessage, err) => {
  var errorObject
  if (typeof err.error === 'object' && typeof err.error.message === 'string') {
    // Web API Error format
    errorObject = new GenericError(err.error.message, err.error.status)
  } else if (typeof err.error === 'string') {
    // Authorization Error format
    /* jshint ignore:start */
    errorObject = new GenericError(err.error + ': ' + err['error_description'])
    /* jshint ignore:end */
  } else if (typeof err === 'string') {
    // Serialized JSON error
    try {
      var parsedError = JSON.parse(err)
      errorObject = new GenericError(parsedError.error.message, parsedError.error.status)
    } catch (err) {
      // Error not JSON formatted
    }
  }

  if (!errorObject) {
    // Unexpected format
    errorObject = new GenericError(defaultMessage + ': ' + JSON.stringify(err))
  }

  return errorObject
}

/* Make the request to the Web API */
HttpManager._makeRequest = (method, options, uri, callback) => {

  method(uri, options)
    .on('success', (data, response) => {
      callback(null, {
        'body': data,
        'headers': response.headers,
        'statusCode': response.statusCode
      })
    })
    .on('fail', (err) => {
      if (err) {
        var errorObject = _getErrorObject('Request failed', err)
        callback(errorObject)
      } else {
        callback(new Error('Request failed'))
      }
    })
    .on('error', (err) => {
      if (err) {
        var errorObject = _getErrorObject('Request error', err)
        callback(errorObject)
      } else {
        callback(new Error('Request error'))
      }
    })
    .on('timeout', (ms) => {
      callback(new Error('Request timed out (' + ms + ')'))
    })
}

/**
 * Make a HTTP GET request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.get = (request, callback) => {
  var options = _getParametersFromRequest(request)
  var method = restler.get

  HttpManager._makeRequest(method, options, request.getURI(), callback)
}

/**
 * Make a HTTP POST request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.post = (request, callback) => {

  var options = _getParametersFromRequest(request)
  var method = restler.post

  HttpManager._makeRequest(method, options, request.getURI(), callback)
}

/**
 * Make a HTTP DELETE request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.del = (request, callback) => {

  var options = _getParametersFromRequest(request)
  var method = restler.del

  HttpManager._makeRequest(method, options, request.getURI(), callback)
}

/**
 * Make a HTTP PUT request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.put = (request, callback) => {

  var options = _getParametersFromRequest(request)
  var method = restler.put

  HttpManager._makeRequest(method, options, request.getURI(), callback)
}

module.exports = HttpManager