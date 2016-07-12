'use strict';

const WebApiRequest = require('./webapi-request');
const HttpManager = require('./http-manager');
const PromiseImpl = require('promise');

function CloudConnectWebApi(credentials) {

  var _credentials = credentials || {};

  function _addBodyParameters(request, options) {
    if (options) {
      for (var key in options) {
        if (key !== 'credentials') {
          request.addBodyParameter(key, options[key]);
        }
      }
    }
  }

  function _addQueryParameters(request, options) {
    if (!options) {
      return;
    }
    for (var key in options) {
      if (key !== 'credentials') {
        request.addQueryParameter(key, options[key]);
      }
    }
  }

  function _performRequest(method, request) {
    var promiseFunction = function (resolve, reject) {
      method(request, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    };
    return new PromiseImpl(promiseFunction);
  }

  function _addUserToken(request, userToken) {
    if (userToken) {
      request.addHeaders({
        'Authorization': 'Basic ' + userToken + ':' + 'X'
      });
    }
  }

  this.setCredentials = function (credentials) {
    for (var key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        _credentials[key] = credentials[key];
      }
    }
  };

  this.getCredentials = function () {
    return _credentials;
  };

  this.getUserToken = function () {
    return _getCredential('userToken');
  };

  function _setCredential(credentialKey, value) {
    _credentials = _credentials || {};
    _credentials[credentialKey] = value;
  }

  function _getCredential(credentialKey) {
    if (!_credentials) {
      return;
    } else {
      return _credentials[credentialKey];
    }
  }

  /**
   * List of existing configurations
   * @param callback
   * @returns {*}
   */
  this.getConfigurations = function (callback) {

    var actualCallback = callback;

    var request = WebApiRequest.builder()
      .withPath('/configurations')
      .build();

    _addUserToken(request, this.getUserToken());

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function (data) {
        actualCallback(null, data);
      }, function (err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Show details for a specific configuration
   * @param configId
   * @param callback
   * @returns {*}
   */
  this.getConfiguration = function (configId, callback) {

    var actualCallback = callback;

    var request = WebApiRequest.builder()
      .withPath('/configurations/' + configId)
      .build();

    _addUserToken(request, this.getUserToken());

    var promise = _performRequest(HttpManager.get, request);

    if (actualCallback) {
      promise.then(function (data) {
        actualCallback(null, data);
      }, function (err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };



}

module.exports = CloudConnectWebApi;
