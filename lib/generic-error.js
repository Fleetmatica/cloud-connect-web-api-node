'use strict';

function GenericError(message, statusCode) {
  this.name = 'WebapiError';
  this.message = (message || '');
  this.statusCode = statusCode;
}

GenericError.prototype = Error.prototype;

module.exports = GenericError;