# cloud-connect-web-api-node

NodeJS API wrapper for Mobile Devices Cloud Connect

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

## TODO

### General

* manage pagination

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