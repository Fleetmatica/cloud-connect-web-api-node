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

  it("should retrieve configurations passing a callbakc", function (done) {
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


});
