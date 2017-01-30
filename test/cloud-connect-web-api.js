'use strict'

const restler = require('restler')
const HttpManager = require('../lib/http-manager')
const sinon = require('sinon')
const CloudConnectWebApi = require('../lib/cloud-connect-web-api')
const should = require('should')

describe('CloudConnect Web API', () => {

  beforeEach((done) => {
    done()
  })

  afterEach((done) => {
    if (typeof HttpManager._makeRequest.restore == 'function') {
      HttpManager._makeRequest.restore()
    }
    done()
  })

  it('should set credentials', () => {
    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    }

    var api = new CloudConnectWebApi(credentials)
    api.getCredentials().userToken.should.equal(credentials.userToken)

  })

  it('should get userToken', () => {
    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    }

    var api = new CloudConnectWebApi(credentials)
    api.getCredentials().userToken.should.equal(credentials.userToken)

  })

  it('should retrieve configurations', (done) => {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get)
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations')
      should.not.exist(options.data)
      callback(null, {
        body: [
          {
            'id': 220145,
            'name': 'Skoda Octavia (App : 0 - Fuel configuration v1.0)',
            'version': '0 - Fuel configuration v1.0',
            'description': null
          }
        ],
        statusCode: 200
      })
    })

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    }


    var api = new CloudConnectWebApi(credentials)
    api.getConfigurations()
      .then(function (data) {
        (data.body[0].id).should.equal(220145);
        (data.statusCode).should.equal(200)
        done()
      }, function (err) {
        done(err)
      })

  })

  describe('Assets configuration', () => {

    it('should retrieve configurations passing a callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', (method, options, uri, callback) => {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 220145,
              'name': 'Skoda Octavia',
              'version': '0',
              'description': null
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getConfigurations(function (err, data) {
        if (err) {
          return done(err)
        }
        (data.body[0].id).should.equal(220145);
        (data.statusCode).should.equal(200)
        done()
      })

    })

    it('should retrieve detailed information about a configuration', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations/409')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'id': 409,
            'name': 'test (Os Munic.io v2.1)',
            'version': 'Munic.io v2.1',
            'description': '',
            'configuration': {
              'speed_provider': 'obd',
              'monitored_over_speed': 'true',
              'monitored_over_rpm': 'true',
              'monitored_idling_state': 'true',
              'monitored_tow_away_state': 'true',
              'monitored_low_external_battery': 'true',
              'monitored_malfunction_indicator_lamp': 'true',
              'monitored_dtc_number': 'false',
              'over_rpm_threshold': '3000',
              'power_delta_voltage_threshold': '1000',
              'idle_movement_timeout': '5',
              'overspeed_threshold': '110',
              'overspeed_duration_threshold': '5',
              'overspeed_reset_threshold': '5',
              'low_battery_threshold': '12000'
            }
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getConfiguration('409')
        .then(function (data) {
          (data.body.id).should.equal(409);
          (data.body.name).should.equal('test (Os Munic.io v2.1)');
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should create a new configuration using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.post)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations')
        JSON.parse(options.data).should.eql({
          'name': 'test api - munic.io',
          'version': 129,
          'data': {
            'monitored_ignition': 'true',
            'monitored_idle_in': 'true',
            'monitored_idle_out': 'true',
            'monitored_journey_state': 'true',
            'speed_provider': 'gps',
            'monitored_over_speed': 'true',
            'monitored_over_rpm': 'true',
            'monitored_idling_state': 'true',
            'monitored_tow_away_state': 'true',
            'monitored_low_external_battery': 'true',
            'monitored_malfunction_indicator_lamp': 'true',
            'monitored_dtc_number': 'true',
            'over_rpm_threshold': '1500',
            'power_delta_voltage_threshold': '1500',
            'idle_movement_timeout': '10',
            'overspeed_threshold': '115',
            'overspeed_duration_threshold': '7',
            'overspeed_reset_threshold': '10',
            'low_battery_threshold': '11000'
          }
        })
        should.not.exist(options.query)
        callback(null, {
          body: {
            'name': 'test api - munic.io (Os MunicOS - Box 2 v3.8)',
            'version': 129,
            'description': '',
            'data': {
              'monitored_ignition': 'true',
              'monitored_idle_in': 'true',
              'monitored_idle_out': 'true',
              'monitored_journey_state': 'true',
              'speed_provider': 'gps',
              'monitored_over_speed': 'true',
              'monitored_over_rpm': 'true',
              'monitored_idling_state': 'true',
              'monitored_tow_away_state': 'true',
              'monitored_low_external_battery': 'true',
              'monitored_malfunction_indicator_lamp': 'true',
              'monitored_dtc_number': 'true',
              'over_rpm_threshold': '1500',
              'power_delta_voltage_threshold': '1500',
              'idle_movement_timeout': '10',
              'overspeed_threshold': '115',
              'overspeed_duration_threshold': '7',
              'overspeed_reset_threshold': '10',
              'low_battery_threshold': '11000'
            }
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      api.createConfiguration(
        'test api - munic.io',
        129,
        {
          'monitored_ignition': 'true',
          'monitored_idle_in': 'true',
          'monitored_idle_out': 'true',
          'monitored_journey_state': 'true',
          'speed_provider': 'gps',
          'monitored_over_speed': 'true',
          'monitored_over_rpm': 'true',
          'monitored_idling_state': 'true',
          'monitored_tow_away_state': 'true',
          'monitored_low_external_battery': 'true',
          'monitored_malfunction_indicator_lamp': 'true',
          'monitored_dtc_number': 'true',
          'over_rpm_threshold': '1500',
          'power_delta_voltage_threshold': '1500',
          'idle_movement_timeout': '10',
          'overspeed_threshold': '115',
          'overspeed_duration_threshold': '7',
          'overspeed_reset_threshold': '10',
          'low_battery_threshold': '11000'
        }, function (err, data) {
          'test api - munic.io (Os MunicOS - Box 2 v3.8)'.should.equal(data.body.name);
          (200).should.equal(data.statusCode)
          done()
        })
    })

    it('should update a configuration using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.put)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations/12302')
        JSON.parse(options.data).should.eql({
          'name': 'test api update - munic.io',
          'data': {
            'monitored_ignition': 'false',
            'monitored_idle_in': 'true',
            'monitored_idle_out': 'true',
            'monitored_journey_state': 'true',
            'speed_provider': 'gps',
            'monitored_over_speed': 'true',
            'monitored_over_rpm': 'true',
            'monitored_idling_state': 'true',
            'monitored_tow_away_state': 'true',
            'monitored_low_external_battery': 'true',
            'monitored_malfunction_indicator_lamp': 'true',
            'monitored_dtc_number': 'true',
            'over_rpm_threshold': '1500',
            'power_delta_voltage_threshold': '1500',
            'idle_movement_timeout': '10',
            'overspeed_threshold': '115',
            'overspeed_duration_threshold': '7',
            'overspeed_reset_threshold': '10',
            'low_battery_threshold': '11000'
          }
        })
        should.not.exist(options.query)
        callback(null, {
          body: {
            'id': '12302',
            'name': 'test api update - munic.io (Os MunicOS - Box 2 v3.8)',
            'data': {
              'monitored_ignition': 'false',
              'monitored_idle_in': 'true',
              'monitored_idle_out': 'true',
              'monitored_journey_state': 'true',
              'speed_provider': 'gps',
              'monitored_over_speed': 'true',
              'monitored_over_rpm': 'true',
              'monitored_idling_state': 'true',
              'monitored_tow_away_state': 'true',
              'monitored_low_external_battery': 'true',
              'monitored_malfunction_indicator_lamp': 'true',
              'monitored_dtc_number': 'true',
              'over_rpm_threshold': '1500',
              'power_delta_voltage_threshold': '1500',
              'idle_movement_timeout': '10',
              'overspeed_threshold': '115',
              'overspeed_duration_threshold': '7',
              'overspeed_reset_threshold': '10',
              'low_battery_threshold': '11000'
            }
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      api.updateConfiguration(
        12302,
        'test api update - munic.io',
        {
          'monitored_ignition': 'false',
          'monitored_idle_in': 'true',
          'monitored_idle_out': 'true',
          'monitored_journey_state': 'true',
          'speed_provider': 'gps',
          'monitored_over_speed': 'true',
          'monitored_over_rpm': 'true',
          'monitored_idling_state': 'true',
          'monitored_tow_away_state': 'true',
          'monitored_low_external_battery': 'true',
          'monitored_malfunction_indicator_lamp': 'true',
          'monitored_dtc_number': 'true',
          'over_rpm_threshold': '1500',
          'power_delta_voltage_threshold': '1500',
          'idle_movement_timeout': '10',
          'overspeed_threshold': '115',
          'overspeed_duration_threshold': '7',
          'overspeed_reset_threshold': '10',
          'low_battery_threshold': '11000'
        },
        function (err, data) {
          'test api update - munic.io (Os MunicOS - Box 2 v3.8)'.should.equal(data.body.name);
          ('false').should.equal(data.body.data.monitored_ignition);
          (200).should.equal(data.statusCode)
          done()
        })
    })

    it('should retrieve all assets linked to a specific configuration', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations/409/assets')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 1215,
              'asset': '359858012812890',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T14:41:20+02:00',
              'last_connection_at': '2014-05-20T14:41:41+02:00',
              'current_configuration': [],
              'os_version_id': 94
            },
            {
              'id': 1232,
              'asset': '357322040071232',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T16:06:18+02:00',
              'last_connection_at': '2014-05-20T16:08:33+02:00',
              'current_configuration': [],
              'os_version_id': 94
            }
          ], statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getConfigurationAssets('409')
        .then(function (data) {
          (data.body[0].id).should.equal(1215);
          (data.body[1].id).should.equal(1232);
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should retrieve all assets linked to a specific configuration', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/configurations/410/compatible_assets')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 1216,
              'asset': '359858012812890',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T14:41:20+02:00',
              'last_connection_at': '2014-05-20T14:41:41+02:00',
              'current_configuration': [],
              'os_version_id': 94
            },
            {
              'id': 1233,
              'asset': '357322040071232',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T16:06:18+02:00',
              'last_connection_at': '2014-05-20T16:08:33+02:00',
              'current_configuration': [],
              'os_version_id': 94
            }
          ], statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getConfigurationCompatibleAssets('410')
        .then(function (data) {
          (data.body[0].id).should.equal(1216);
          (data.body[1].id).should.equal(1233);
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

  })

  describe('Assets', () => {

    it('should retrieve list of visible assets', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 1215,
              'asset': '359858012812890',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T14:41:20+02:00',
              'last_connection_at': '2014-05-20T14:41:41+02:00',
              'current_configuration': [],
              'os_version_id': 93,
              'module_version_ids': [18]
            },
            {
              'id': 1232,
              'asset': '357322040071289',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T16:06:18+02:00',
              'last_connection_at': '2014-05-20T16:08:33+02:00',
              'current_configuration': [],
              'os_version_id': 94,
              'module_version_ids': []
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }


      var api = new CloudConnectWebApi(credentials)
      api.getAssets(function (err, data) {
        if (err) {
          return done(err)
        }
        (data.body[0].id).should.equal(1215);
        (data.statusCode).should.equal(200)
        done()
      })
    })

    it('should retrieve list of visible assets filtered by os_version and assets_num', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 1232,
              'asset': '357322040071289',
              'asset_group_id': null,
              'last_activity_at': '2014-05-20T16:06:18+02:00',
              'last_connection_at': '2014-05-20T16:08:33+02:00',
              'current_configuration': [],
              'os_version_id': 94,
              'module_version_ids': []
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAssets({'filter': 1289, 'os_version_id': '94'})
        .then(function (data) {
          (data.body[0].id).should.equal(1232);
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should retrieve a specific asset', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets/359858012812890')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'id': 1215,
            'asset': '359858012812890',
            'asset_group_id': null,
            'last_activity_at': '2014-05-20T14:41:20+02:00',
            'last_connection_at': '2014-05-20T14:41:41+02:00',
            'current_configuration': [],
            'os_version_id': 93,
            'module_version_ids': [14, 15, 16, 19],
            'pending_configuration': []
          },
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAsset('359858012812890')
        .then(function (data) {
          (data.body.id).should.equal(1215);
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should retrieve a specific asset with pending_configuration option', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets/359858012812890')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'id': 1215,
            'asset': '359858012812890',
            'asset_group_id': null,
            'last_activity_at': '2014-05-20T14:41:20+02:00',
            'last_connection_at': '2014-05-20T14:41:41+02:00',
            'current_configuration': [],
            'os_version_id': 93,
            'module_version_ids': [14, 15, 16, 19],
            'pending_configuration': []
          },
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAsset('359858012812890', {'pending_configuration': 'some_config_id'})
        .then(function (data) {
          (data.body.id).should.equal(1215);
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should retrieve vehicle information declare on the asset', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets/359858012812890/vehicle_informations')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'mark': 'VW',
            'model': 'GOLF',
            'year': '2014',
            'engine': '2.0 TDI'
          },
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getVehicleInfo('359858012812890')
        .then(function (data) {
          (data.body.mark).should.equal('VW');
          (data.body.model).should.equal('GOLF');
          (data.body.year).should.equal('2014');
          (data.body.engine).should.equal('2.0 TDI');
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should update vehicle information of specific asset using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.put)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets/359858012812890/vehicle_informations')
        JSON.parse(options.data).should.eql({
          'mark': 'VW',
          'model': 'GOLF',
          'year': '2015',
          'engine': '2.0 TDI'
        })
        should.not.exist(options.query)
        callback(null, {
          body: {
            'mark': 'VW',
            'model': 'GOLF',
            'year': '2015',
            'engine': '2.0 TDI'
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      api.updateVehicleInfo('359858012812890',
        {
          'mark': 'VW',
          'model': 'GOLF',
          'year': '2015',
          'engine': '2.0 TDI'
        },
        function (err, data) {
          (data.body.mark).should.equal('VW');
          (data.body.model).should.equal('GOLF');
          (data.body.year).should.equal('2015');
          (data.body.engine).should.equal('2.0 TDI');
          (data.statusCode).should.equal(200)
          done()
        })
    })

    it('should retrieve the current configuration for an asset', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets/359858012812890/current_configuration')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'os': {
              'id': 123,
              'name': 'test (Os Munic.io v2.1)',
              'version': 'Munic.io v2.1',
              'version_id': 42,
              'description': '',
              'configuration': {
                'speed_provider': 'obd',
                'monitored_over_speed': 'true',
              }
            },
            'modules': [
              {
                'id': 456,
                'name': 'App test (Test v1.1)',
                'version': 'Test v1.1',
                'version_id': 12,
                'description': '',
                'configuration': {
                  'low_battery_threshold': '12000',
                  'idle_movement_timeout': '5',
                  'overspeed_threshold': '110'
                }
              }
            ]
          },
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAssetConfiguration('359858012812890')
        .then(function (data) {
          (data.body.os.id).should.equal(123);
          (data.body.modules[0].id).should.equal(456);
          (data.body.modules[0].configuration.low_battery_threshold).should.equal('12000');
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

  })

  describe('Assets groups', () => {

    it('should retrieve assets groups passing a callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets_groups')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 53,
              'name': 'kaki',
              'assets': ['359858024351692', '359858021918949']
            },
            {
              'id': 52,
              'name': 'Group 52',
              'assets': ['359858024351692']
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAssetsGroups(function (err, data) {
        if (err) {
          return done(err)
        }
        (data.body[0].id).should.equal(53);
        (data.statusCode).should.equal(200)
        done()
      })

    })

    it('should retrieve detailed information about a specific asset group', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets_groups/53')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'id': 53,
            'name': 'kaki',
            'assets': ['359858024351692', '359858021918949']
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getAssetsGroup('53')
        .then(function (data) {
          (data.body.id).should.equal(53);
          (data.body.name).should.equal('kaki');
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should create a new asset group using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.post)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets_groups')
        JSON.parse(options.data).should.eql(
          {
            'name': 'test group',
            'asset_imeis': ['359858024351692', '359858021918949']
          }
        )
        should.not.exist(options.query)

        callback(null, {
          body: {
            'name': 'test group',
            'assets': ['359858024351692', '359858021918949']
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      var options = {
        'name': 'test group',
        'asset_imeis': ['359858024351692', '359858021918949']
      }

      api.createAssetsGroup(options, function (err, data) {
        'test group'.should.equal(data.body.name);
        (200).should.equal(data.statusCode)
        done()
      })
    })

    it('should update a configuration using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.put)
        uri.should.equal('https://dashboard.munic.io/api/v2/assets_groups/54')
        JSON.parse(options.data).should.eql(
          {
            'name': 'test group renamed',
            'asset_imeis': ['359858024351692']
          }
        )
        should.not.exist(options.query)
        callback(null, {
          body: {
            'id': 54,
            'name': 'test group renamed',
            'assets': ['359858024351692']
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      api.updateAssetsGroup(
        54,
        {
          'name': 'test group renamed',
          'asset_imeis': ['359858024351692']
        },
        function (err, data) {
          (54).should.equal(data.body.id)
          'test group renamed'.should.equal(data.body.name);
          (200).should.equal(data.statusCode)
          done()
        })
    })

  })

  describe('Campaigns', () => {

    it('should retrieve campaigns passing a callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 271,
              'name': 'Campaign test 2',
              'created_at': 'April 28, 2014 15:37',
              'status': 'Pending',
              'targeted_asset_count': 9,
              'asset_group_count': 1,
              'warnings': '2 incompatible assets'
            },
            {
              'id': 270,
              'name': 'Campaign test 1',
              'created_at': 'April 25, 2014 13:28',
              'status': 'Sent',
              'targeted_asset_count': 1,
              'asset_group_count': 1
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getCampaigns(function (err, data) {
        if (err) {
          return done(err)
        }
        (data.body[0].id).should.equal(271);
        (data.body[1].name).should.equal('Campaign test 1');
        (data.statusCode).should.equal(200)
        done()
      })

    })

    it('should retrieve archived campaigns passing a callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns?archived=true')
        should.not.exist(options.data)
        callback(null, {
          body: [
            {
              'id': 275,
              'name': 'Archived Campaign test 2',
              'created_at': 'April 28, 2014 15:37',
              'status': 'Pending',
              'targeted_asset_count': 9,
              'asset_group_count': 1,
              'warnings': '2 incompatible assets'
            },
            {
              'id': 276,
              'name': 'Archived Campaign test 1',
              'created_at': 'April 25, 2014 13:28',
              'status': 'Sent',
              'targeted_asset_count': 1,
              'asset_group_count': 1
            }
          ],
          statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getCampaignsArchive(function (err, data) {
        if (err) {
          return done(err)
        }
        (data.body[0].id).should.equal(275);
        (data.body[0].name).should.equal('Archived Campaign test 2');
        (data.statusCode).should.equal(200)
        done()
      })

    })

    it('should retrieve detailed information about a campaign', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.get)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns/271')
        should.not.exist(options.data)
        callback(null, {
          body: {
            'id': 271,
            'name': 'Ze aPi TEst3',
            'created_at': 'April 28, 2014 15:37',
            'status': 'Pending',
            'asset_configuration_list': [390, 397],
            'targeted_asset_count': 1,
            'targeted_assets': [],
            'assets_status': [{'imei': 'XXX', 'status': ''}],
            'asset_group_count': 1,
            'asset_group_ids': [52],
            'warnings': ['The following assets are not compatible with the campaign\'s configurations : ', ['359858024444692']]
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)
      api.getCampaign('271')
        .then(function (data) {
          (data.body.id).should.equal(271);
          (data.body.name).should.equal('Ze aPi TEst3');
          (data.statusCode).should.equal(200)
          done()
        }, function (err) {
          done(err)
        })

    })

    it('should create a campaign to update the configuation using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.post)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns')
        JSON.parse(options.data).should.eql(
          {
            'name': 'test campaign',
            'asset_group_ids': [],
            'update_type': 0,
            'config_ids': [414, 413],
            'targeted_asset_imeis': ['357322044471026', '359858033385302'],
            'ignore_last_campaign': false,
            'force_update': false
          }
        )
        should.not.exist(options.query)

        callback(null, {
          body: {
            'id': 272,
            'name': 'test campaign',
            'created_at': 'April 28, 2014 15:37',
            'status': 'Pending',
            'asset_configuration_list': [414, 413],
            'targeted_asset_count': 2,
            'targeted_assets': ['357322044471026', '359858033385302'],
            'asset_group_count': 0,
            'asset_group_ids': [],
            'warnings': ['The following assets are not compatible with the campaign\'s configurations : ', ['357322044471026']]
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      var configIds = [414, 413]
      var options = {
        'name': 'test campaign',
        'asset_group_ids': [],
        'targeted_asset_imeis': ['357322044471026', '359858033385302'],
        'ignore_last_campaign': false,
        'force_update': false
      }

      api.createCampaignToUpdateConfig(configIds, options, function (err, data) {
        if (err) {
          return done(err)
        }
        console.log(data)
        'test campaign'.should.equal(data.body.name);
        (200).should.equal(data.statusCode)
        done()
      })
    })

    it('should create a campaign to update the software using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.post)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns')
        JSON.parse(options.data).should.eql(
          {
            'name': 'test campaign',
            'asset_group_ids': [],
            'to_version': 28,
            'update_type': 1,
            'targeted_asset_imeis': ['357322044471026', '359858033385302'],
            'ignore_last_campaign': false,
            'force_update': false
          }
        )
        should.not.exist(options.query)

        callback(null, {
          body: {
            'id': 272,
            'name': 'test campaign',
            'created_at': 'April 28, 2014 15:37',
            'status': 'Pending',
            'asset_configuration_list': [414, 413],
            'targeted_asset_count': 2,
            'targeted_assets': ['357322044471026', '359858033385302'],
            'asset_group_count': 0,
            'asset_group_ids': [],
            'warnings': ['The following assets are not compatible with the campaign\'s configurations : ', ['357322044471026']]
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      var newVersion = 28
      var options = {
        'name': 'test campaign',
        'asset_group_ids': [],
        'targeted_asset_imeis': ['357322044471026', '359858033385302'],
        'ignore_last_campaign': false,
        'force_update': false
      }

      api.createCampaignToUpdateSoftware(newVersion, options, function (err, data) {
        if (err) {
          return done(err)
        }
        'test campaign'.should.equal(data.body.name);
        (200).should.equal(data.statusCode)
        done()
      })
    })

    it('should update a campaign using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.put)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns/272/edit')
        JSON.parse(options.data).should.eql({
          'name' : 'test campaign renamed'
        })
        should.not.exist(options.query)
        callback(null, {
          body: {
            'id': 272,
            'name': 'test campaign renamed',
            'created_at': 'April 28, 2014 15:37',
            'status': 'Pending',
            'asset_configuration_list': [414, 413],
            'targeted_asset_count': 2,
            'targeted_assets': ['357322044471026', '359858033385302'],
            'asset_group_count': 0,
            'asset_group_ids': [],
            'warnings': ['The following assets are not compatible with the campaign\'s configurations : ', ['357322044471026']]
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      var options = {
        'name' : 'test campaign renamed'
      }

      api.updateCampaign(272, options, function (err, data) {
        if (err) {
          return done(err)
        }
        (272).should.equal(data.body.id)
        'test campaign renamed'.should.equal(data.body.name)
        'Pending'.should.equal(data.body.status);
        (200).should.equal(data.statusCode)
        done()
      })

    })

    it('should launch a campaign using callback', (done) => {
      sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
        method.should.equal(restler.put)
        uri.should.equal('https://dashboard.munic.io/api/v2/campaigns/272/launch')
        JSON.parse(options.data).should.eql({})
        should.not.exist(options.query)
        callback(null, {
          body: {
            'id': 272,
            'name': 'test campaign renamed',
            'created_at': 'April 28, 2014 15:37',
            'status': 'Sent',
            'asset_configuration_list': [414, 413],
            'targeted_asset_count': 2,
            'targeted_assets': ['357322044471026', '359858033385302'],
            'asset_group_count': 0,
            'asset_group_ids': [],
            'warnings': ['The following assets are not compatible with the campaign\'s configurations : ', ['357322044471026']]
          }, statusCode: 200
        })
      })

      var credentials = {
        userToken: '653638dc733afce75130303fe6e6010f63768af0'
      }

      var api = new CloudConnectWebApi(credentials)

      api.launchCampaign(272, {}, function (err, data) {
        if (err) {
          return done(err)
        }
        (272).should.equal(data.body.id)
        'test campaign renamed'.should.equal(data.body.name)
        'Sent'.should.equal(data.body.status);
        (200).should.equal(data.statusCode)
        done()
      })

    })

  })

})
