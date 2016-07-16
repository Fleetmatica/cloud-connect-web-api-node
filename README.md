# cloud-connect-web-api-node

NodeJS API wrapper for Mobile Devices Cloud Connect

[![Build Status](https://travis-ci.org/ceccode/cloud-connect-web-api-node.svg?branch=master)](https://travis-ci.org/ceccode/cloud-connect-web-api-node)
[![Known Vulnerabilities](https://snyk.io/test/github/ceccode/cloud-connect-web-api-node/badge.svg)](https://snyk.io/test/github/ceccode/cloud-connect-web-api-node)
[![https://david-dm.org/ceccode/cloud-connect-web-api-node.svg](https://david-dm.org/ceccode/cloud-connect-web-api-node.svg)](https://david-dm.org/ceccode/cloud-connect-web-api-node.svg)


## Usage

```
const CloudConnectWebApi = require('cloud-connect-web-api');

let credentials = {
  userToken: '653638dc733afce75130303fe6e6010f63768af0'
};

let api = new CloudConnectWebApi(credentials);

//using callback
api.getConfigurations(function(err, data){
  if (err) throw err;
  console.log(data);
}); 

//using promise
api.getConfigurations()
  .then(function (data) {
    console.log(data);
  }, function (err) {
    console.log(err);
  });
```

## API

### Asset configurations

Visible configurations information

#### List of existing configurations

`getConfigurations()`

#### Show details for a specific configuration

`getConfiguration(configId)`

#### Create a new configuration

`createConfiguration(configName, version, options)`

#### Update existing configuration

`updateConfiguration(configId, configName, options)`

#### List all assets linked to a specific configuration

`getConfigurationAssets(configId)`

#### List all assets compatible with a specific configuration

`getConfigurationCompatibleAssets(configId)`

### Assets

#### List of visible assets

`getAssets(options, cb)`

#### Get a specific asset

`getAsset(imei, options, cb)`

#### Show vehicle information declare on the asset

`getVehicleInfo(imei, cb)`

#### Update vehicle information declare on the asset

`updateVehicleInfo(imei, options, cb)`

#### Retrieve the current configuration for a specific asset and return the configuration for the OS version and for each module that could be configured.

`getAssetConfiguration(imei, cb)`


## TODO

### General

* manage pagination
* improve docs

### API

* Assets groups
* Campaigns 
* Driver profiles 
* Remote files 
* Vehicles 
* Versions 


## Test

```
npm test
```

## Coverage

```
npm run-script test-travis
```


## License

[MIT license](LICENSE)