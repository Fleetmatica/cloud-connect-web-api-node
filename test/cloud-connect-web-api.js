var restler = require('restler'),
  HttpManager = require('../lib/http-manager'),
  sinon = require('sinon'),
  CloudConnectWebApi = require('../lib/cloud-connect-web-api'),
  GenericError = require('../lib/generic-error'),
  should = require('should');

'use strict';

describe('CloudConnect Web API', function () {

  beforeEach(function (done) {
    done();
  });

  afterEach(function (done) {
    if (typeof HttpManager._makeRequest.restore == 'function') {
      HttpManager._makeRequest.restore();
    }
    done();
  });

  this.timeout(5000);

  it('should set credentials', function () {
    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getCredentials().userToken.should.equal(credentials.userToken);

  });

  it('should get userToken', function () {
    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getCredentials().userToken.should.equal(credentials.userToken);

  });

  it("should retrieve configurations", function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations');
      should.not.exist(options.data);
      callback(null, {
        body: [
          {
            "id": 220145,
            "name": "Skoda Octavia (App : 0 - Fuel configuration v1.0)",
            "version": "0 - Fuel configuration v1.0",
            "description": null
          }
        ],
        statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };


    var api = new CloudConnectWebApi(credentials);
    api.getConfigurations()
      .then(function (data) {
        (data.body[0].id).should.equal(220145);
        (data.statusCode).should.equal(200);
        done();
      }, function (err) {
        done(err);
      });

  });

  it("should retrieve configurations passing a callback", function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations');
      should.not.exist(options.data);
      callback(null, {
        body: [
          {
            "id": 220145,
            "name": "Skoda Octavia",
            "version": "0",
            "description": null
          }
        ],
        statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getConfigurations(function (err, data) {

      if (err) {
        return done(err);
      }
      (data.body[0].id).should.equal(220145);
      (data.statusCode).should.equal(200);
      done();
    });

  });

  it("should retrieve detailed information about a configuration", function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations/409');
      should.not.exist(options.data);
      callback(null, {
        body: {
          "id": 409,
          "name": "test (Os Munic.io v2.1)",
          "version": "Munic.io v2.1",
          "description": "",
          "configuration": {
            "speed_provider": "obd",
            "monitored_over_speed": "true",
            "monitored_over_rpm": "true",
            "monitored_idling_state": "true",
            "monitored_tow_away_state": "true",
            "monitored_low_external_battery": "true",
            "monitored_malfunction_indicator_lamp": "true",
            "monitored_dtc_number": "false",
            "over_rpm_threshold": "3000",
            "power_delta_voltage_threshold": "1000",
            "idle_movement_timeout": "5",
            "overspeed_threshold": "110",
            "overspeed_duration_threshold": "5",
            "overspeed_reset_threshold": "5",
            "low_battery_threshold": "12000"
          }
        }, statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getConfiguration('409')
      .then(function (data) {
        (data.body.id).should.equal(409);
        (data.body.name).should.equal('test (Os Munic.io v2.1)');
        (data.statusCode).should.equal(200);
        done();
      }, function (err) {
        done(err);
      });

  });

  it('should create a new configuration using callback', function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.post);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations');
      JSON.parse(options.data).should.eql({
        "name": "test api - munic.io",
        "version": 129,
        "data": {
          "monitored_ignition": "true",
          "monitored_idle_in": "true",
          "monitored_idle_out": "true",
          "monitored_journey_state": "true",
          "speed_provider": "gps",
          "monitored_over_speed": "true",
          "monitored_over_rpm": "true",
          "monitored_idling_state": "true",
          "monitored_tow_away_state": "true",
          "monitored_low_external_battery": "true",
          "monitored_malfunction_indicator_lamp": "true",
          "monitored_dtc_number": "true",
          "over_rpm_threshold": "1500",
          "power_delta_voltage_threshold": "1500",
          "idle_movement_timeout": "10",
          "overspeed_threshold": "115",
          "overspeed_duration_threshold": "7",
          "overspeed_reset_threshold": "10",
          "low_battery_threshold": "11000"
        }
      });
      should.not.exist(options.query);
      callback(null, {
        body: {
          "name": "test api - munic.io (Os MunicOS - Box 2 v3.8)",
          "version": 129,
          "description": "",
          "data": {
            "monitored_ignition": "true",
            "monitored_idle_in": "true",
            "monitored_idle_out": "true",
            "monitored_journey_state": "true",
            "speed_provider": "gps",
            "monitored_over_speed": "true",
            "monitored_over_rpm": "true",
            "monitored_idling_state": "true",
            "monitored_tow_away_state": "true",
            "monitored_low_external_battery": "true",
            "monitored_malfunction_indicator_lamp": "true",
            "monitored_dtc_number": "true",
            "over_rpm_threshold": "1500",
            "power_delta_voltage_threshold": "1500",
            "idle_movement_timeout": "10",
            "overspeed_threshold": "115",
            "overspeed_duration_threshold": "7",
            "overspeed_reset_threshold": "10",
            "low_battery_threshold": "11000"
          }
        }, statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);

    api.createConfiguration(
      'test api - munic.io',
      129,
      {
        "monitored_ignition": "true",
        "monitored_idle_in": "true",
        "monitored_idle_out": "true",
        "monitored_journey_state": "true",
        "speed_provider": "gps",
        "monitored_over_speed": "true",
        "monitored_over_rpm": "true",
        "monitored_idling_state": "true",
        "monitored_tow_away_state": "true",
        "monitored_low_external_battery": "true",
        "monitored_malfunction_indicator_lamp": "true",
        "monitored_dtc_number": "true",
        "over_rpm_threshold": "1500",
        "power_delta_voltage_threshold": "1500",
        "idle_movement_timeout": "10",
        "overspeed_threshold": "115",
        "overspeed_duration_threshold": "7",
        "overspeed_reset_threshold": "10",
        "low_battery_threshold": "11000"
      }, function (err, data) {
        'test api - munic.io (Os MunicOS - Box 2 v3.8)'.should.equal(data.body.name);
        (200).should.equal(data.statusCode);
        done();
      });
  });

  it('should update a configuration using callback', function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.put);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations/12302');
      JSON.parse(options.data).should.eql({
        "name": "test api update - munic.io",
        "data": {
          "monitored_ignition": "false",
          "monitored_idle_in": "true",
          "monitored_idle_out": "true",
          "monitored_journey_state": "true",
          "speed_provider": "gps",
          "monitored_over_speed": "true",
          "monitored_over_rpm": "true",
          "monitored_idling_state": "true",
          "monitored_tow_away_state": "true",
          "monitored_low_external_battery": "true",
          "monitored_malfunction_indicator_lamp": "true",
          "monitored_dtc_number": "true",
          "over_rpm_threshold": "1500",
          "power_delta_voltage_threshold": "1500",
          "idle_movement_timeout": "10",
          "overspeed_threshold": "115",
          "overspeed_duration_threshold": "7",
          "overspeed_reset_threshold": "10",
          "low_battery_threshold": "11000"
        }
      });
      should.not.exist(options.query);
      callback(null, {
        body: {
          "id": "12302",
          "name": "test api update - munic.io (Os MunicOS - Box 2 v3.8)",
          "data": {
            "monitored_ignition": "false",
            "monitored_idle_in": "true",
            "monitored_idle_out": "true",
            "monitored_journey_state": "true",
            "speed_provider": "gps",
            "monitored_over_speed": "true",
            "monitored_over_rpm": "true",
            "monitored_idling_state": "true",
            "monitored_tow_away_state": "true",
            "monitored_low_external_battery": "true",
            "monitored_malfunction_indicator_lamp": "true",
            "monitored_dtc_number": "true",
            "over_rpm_threshold": "1500",
            "power_delta_voltage_threshold": "1500",
            "idle_movement_timeout": "10",
            "overspeed_threshold": "115",
            "overspeed_duration_threshold": "7",
            "overspeed_reset_threshold": "10",
            "low_battery_threshold": "11000"
          }
        }, statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);

    api.updateConfiguration(
      12302,
      'test api update - munic.io',
      {
        "monitored_ignition": "false",
        "monitored_idle_in": "true",
        "monitored_idle_out": "true",
        "monitored_journey_state": "true",
        "speed_provider": "gps",
        "monitored_over_speed": "true",
        "monitored_over_rpm": "true",
        "monitored_idling_state": "true",
        "monitored_tow_away_state": "true",
        "monitored_low_external_battery": "true",
        "monitored_malfunction_indicator_lamp": "true",
        "monitored_dtc_number": "true",
        "over_rpm_threshold": "1500",
        "power_delta_voltage_threshold": "1500",
        "idle_movement_timeout": "10",
        "overspeed_threshold": "115",
        "overspeed_duration_threshold": "7",
        "overspeed_reset_threshold": "10",
        "low_battery_threshold": "11000"
      },
      function (err, data) {
        'test api update - munic.io (Os MunicOS - Box 2 v3.8)'.should.equal(data.body.name);
        ("false").should.equal(data.body.data.monitored_ignition);
        (200).should.equal(data.statusCode);
        done();
      });
  });

  it("should retrieve all assets linked to a specific configuration", function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations/409/assets');
      should.not.exist(options.data);
      callback(null, {
        body: [
          {
            "id": 1215,
            "asset": "359858012812890",
            "asset_group_id": null,
            "last_activity_at": "2014-05-20T14:41:20+02:00",
            "last_connection_at": "2014-05-20T14:41:41+02:00",
            "current_configuration": [],
            "os_version_id": 94
          },
          {
            "id": 1232,
            "asset": "357322040071232",
            "asset_group_id": null,
            "last_activity_at": "2014-05-20T16:06:18+02:00",
            "last_connection_at": "2014-05-20T16:08:33+02:00",
            "current_configuration": [],
            "os_version_id": 94
          }
        ], statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getConfigurationAssets('409')
      .then(function (data) {
        (data.body[0].id).should.equal(1215);
        (data.body[1].id).should.equal(1232);
        (data.statusCode).should.equal(200);
        done();
      }, function (err) {
        done(err);
      });

  });

  it("should retrieve all assets linked to a specific configuration", function (done) {
    sinon.stub(HttpManager, '_makeRequest', function (method, options, uri, callback) {
      method.should.equal(restler.get);
      uri.should.equal('https://dashboard.munic.io/api/v2/configurations/410/compatible_assets');
      should.not.exist(options.data);
      callback(null, {
        body: [
          {
            "id": 1216,
            "asset": "359858012812890",
            "asset_group_id": null,
            "last_activity_at": "2014-05-20T14:41:20+02:00",
            "last_connection_at": "2014-05-20T14:41:41+02:00",
            "current_configuration": [],
            "os_version_id": 94
          },
          {
            "id": 1233,
            "asset": "357322040071232",
            "asset_group_id": null,
            "last_activity_at": "2014-05-20T16:06:18+02:00",
            "last_connection_at": "2014-05-20T16:08:33+02:00",
            "current_configuration": [],
            "os_version_id": 94
          }
        ], statusCode: 200
      });
    });

    var credentials = {
      userToken: '653638dc733afce75130303fe6e6010f63768af0'
    };

    var api = new CloudConnectWebApi(credentials);
    api.getConfigurationCompatibleAssets('410')
      .then(function (data) {
        (data.body[0].id).should.equal(1216);
        (data.body[1].id).should.equal(1233);
        (data.statusCode).should.equal(200);
        done();
      }, function (err) {
        done(err);
      });

  });

})
;
