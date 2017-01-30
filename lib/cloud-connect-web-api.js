'use strict'

const WebApiRequest = require('./webapi-request')
const HttpManager = require('./http-manager')
const PromiseImpl = require('promise')

function CloudConnectWebApi(credentials) {

  let _credentials = credentials || {}
  
  function _performRequest(method, request) {
    let promiseFunction = (resolve, reject) => {
      method(request, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    }
    return new PromiseImpl(promiseFunction)
  }

  function _addUserToken(request, userToken) {

    let token = new Buffer(userToken + ':' + 'ABC')
    let base64token = token.toString('base64')

    if (userToken) {     
      request.addHeaders({
        'Authorization': 'Basic ' + base64token
      })
    }
    return request
  }

  this.setCredentials = (credentials) => {
    for (let key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        _credentials[key] = credentials[key]
      }
    }
  }

  this.getCredentials = () => {
    return _credentials
  }

  this.getUserToken = () => {
    return _getCredential('userToken')
  }

  function _getCredential(credentialKey) {
    if (!_credentials) {
      return
    } else {
      return _credentials[credentialKey]
    }
  }

  /**
   * List of existing configurations
   * @param callback
   * @returns {*}
   */
  this.getConfigurations = (callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/configurations')
      .build()

    
    request = _addUserToken(request, this.getUserToken())


    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Show details for a specific configuration
   * @param configId
   * @param callback
   * @returns {*}
   */
  this.getConfiguration = (configId, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/configurations/' + configId)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Create a new configuration
   *
   * @param configName
   * @param version //OS version: https://dashboard.munic.io/api_doc/v2/versions.html
   * @param options
   * @param callback
   * @returns {*}
   */
  this.createConfiguration = (configName, version, options, callback) => {

    // In case someone is using a version where options parameter did not exist.
    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {
      'name': configName,
      'version': version,
      data: {}
    }
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions.data[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.post, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Update existing configuration
   *
   * @param configId
   * @param configName
   * @param options
   * @param callback
   * @returns {*}
   */
  this.updateConfiguration = (configId, configName, options, callback) => {

    // In case someone is using a version where options parameter did not exist.
    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {
      'name': configName,
      data: {}
    }
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions.data[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations/' + configId)
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.put, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List all assets linked to a specific configuration
   *
   * @param configId
   * @param callback
   * @returns {*}
   */
  this.getConfigurationAssets = (configId, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations/' + configId + '/assets')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List all assets compatible with a specific configuration
   *
   * @param configId
   * @param {Object} [options] The possible options, currently only market.
   * @param callback
   * @returns {*}
   */
  this.getConfigurationCompatibleAssets = (configId, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/configurations/' + configId + '/compatible_assets')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List of visible assets
   *
   * @param options
   * @param callback
   * @returns {*}
   */
  this.getAssets = (options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withPath('/assets')
      .withQueryParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Get a specific asset
   *
   * @param imei
   * @param options
   * @param callback
   * @returns {*}
   */
  this.getAsset = (imei, options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withPath('/assets/' + imei)
      .withQueryParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Show vehicle information declare on the asset
   *
   * @param imei
   * @param callback
   * @returns {*}
   */
  this.getAssetVehicleInfo = (imei, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/assets/' + imei + '/vehicle_informations')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Update vehicle information declare on the asset
   *
   * @param imei
   * @param options
   * @param callback
   * @returns {*}
   */
  this.updateAssetVehicleInfo = (imei, options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/assets/' + imei + '/vehicle_informations')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.put, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Get the current configuration
   *
   * Retrieve the current configuration for a specific asset and return the configuration for the OS version and for each module that could be configured. If id and name and description are not present the configuration does not exist and we return the default configuration for the Os or module
   *
   * @param imei
   * @param callback
   */
  this.getAssetConfiguration = (imei, callback) => {
    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/assets/' + imei + '/current_configuration')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List of existing asset groups
   * @param callback
   * @returns {*}
   */
  this.getAssetsGroups = (callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/assets_groups')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Show details for a specific asset group
   *
   * @param assetGroupId
   * @param callback
   * @returns {*}
   */
  this.getAssetsGroup = (assetGroupId, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/assets_groups/' + assetGroupId)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Create a new asset group
   *
   * @param options
   * @param callback
   * @returns {*}
   */
  this.createAssetsGroup = (options, callback) => {

    // In case someone is using a version where options parameter did not exist.
    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/assets_groups')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.post, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Update existing configuration
   *
   * @param assetGroupId
   * @param options
   * @param callback
   * @returns {*}
   */
  this.updateAssetsGroup = (assetGroupId, options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/assets_groups/' + assetGroupId)
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.put, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List of visible campaigns
   * @param callback
   * @returns {*}
   */
  this.getCampaigns = (callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/campaigns')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * List of archived campaigns
   * @param callback
   * @returns {*}
   */
  this.getCampaignsArchive = (callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/campaigns?archived=true')
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Get a specific campaign
   *
   * @param campaignId
   * @param callback
   * @returns {*}
   */
  this.getCampaign = (campaignId, callback) => {

    let actualCallback = callback

    let request = WebApiRequest.builder()
      .withPath('/campaigns/' + campaignId)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.get, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Create a campaign to update the configuation
   *
   * @param options
   * @param callback
   * @returns {*}
   */
  this.createCampaignToUpdateConfig = (configIds, options, callback) => {

    let actualCallback = callback

    let actualOptions = Object.assign({
      'config_ids': configIds,
      'update_type': 0
    }, options)
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/campaigns')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.post, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Create a campaign to update the software
   *
   * @param options
   * @param callback
   * @returns {*}
   */
  this.createCampaignToUpdateSoftware = (newVersion, options, callback) => {

    let actualCallback = callback

    let actualOptions = Object.assign({
      'to_version': newVersion,
      'update_type': 1
    }, options)
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/campaigns')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.post, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Edit a campaign
   * Modify an assets name, provide a new list of assets or change configurations
   *
   * @param campaignId
   * @param options
   * @param callback
   * @returns {*}
   */
  this.updateCampaign = (campaignId, options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}
    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        actualOptions[key] = options[key]
      })
    }

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/campaigns/' + campaignId + '/edit')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.put, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

  /**
   * Launch a campaign targeting all assets both compatible and not already being updated in another campaign.
   *
   * @param campaignId
   * @param options
   * @param callback
   * @returns {*}
   */
  this.launchCampaign = (campaignId, options, callback) => {

    let actualCallback
    if (typeof options === 'function') {
      actualCallback = options
    } else {
      actualCallback = callback
    }

    let actualOptions = {}

    let request = WebApiRequest.builder()
      .withVersion('v2')
      .withPath('/campaigns/' + campaignId + '/launch')
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBodyParameters(actualOptions)
      .build()

    request = _addUserToken(request, this.getUserToken())

    let promise = _performRequest(HttpManager.put, request)

    if (actualCallback) {
      promise.then((data) => {
        actualCallback(null, data)
      }, (err) => {
        actualCallback(err)
      })
    } else {
      return promise
    }
  }

}

module.exports = CloudConnectWebApi