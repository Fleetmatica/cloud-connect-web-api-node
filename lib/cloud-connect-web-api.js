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

  /**
   * Create a new configuration
   *
   * @param configName
   * @param version //OS version: https://dashboard.munic.io/api_doc/v2/versions.html
   * @param options
   * @param callback
   * @returns {*}
   */
  this.createConfiguration = function(configName, version, options, callback) {

    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = { 'name' : configName, 'version': version, data: {} };
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions.data[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(actualOptions)
      .build();

    _addUserToken(request, this.getUserToken());

    var promise = _performRequest(HttpManager.post, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

  /**
   * Update existing configuration
   *
   * @param configId
   * @param configName
   * @param options
   * @param callback
   * @returns {*}
   */
  this.updateConfiguration = function(configId, configName, options, callback) {

    // In case someone is using a version where options parameter did not exist.
    var actualCallback;
    if (typeof options === 'function') {
      actualCallback = options;
    } else {
      actualCallback = callback;
    }

    var actualOptions = { 'name' : configName, data: {} };
    if (typeof options === 'object') {
      Object.keys(options).forEach(function(key) {
        actualOptions.data[key] = options[key];
      });
    }

    var request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations/' + configId)
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(actualOptions)
      .build();

    _addUserToken(request, this.getUserToken());

    var promise = _performRequest(HttpManager.put, request);

    if (actualCallback) {
      promise.then(function(data) {
        actualCallback(null, data);
      }, function(err) {
        actualCallback(err);
      });
    } else {
      return promise;
    }
  };

}

module.exports = CloudConnectWebApi;
