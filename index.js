'use strict';
var url = 'http://gisprpxy.itd.state.ma.us/MassGISCustomGeocodeLatLongApplication/MassGISCustomGeocodeService.asmx';
var Handlebars = require('handlebars');
var multiline = require('multiline');
var request = require('request');
var sax = require('sax');
var template = Handlebars.compile(multiline(function () {/*
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GeocodeAddress xmlns="http://tempuri.org/">
      {{#if address}}<Address>{{address}}</Address>{{/if}}
      {{#if city}}<City>city</City>{{/if}}
      {{#if zip}}<ZipCode>{{zip}}</ZipCode>{{/if}}
      <State>MA</State>
    </GeocodeAddress>
  </soap:Body>
</soap:Envelope>
*/}));
module.exports = function (obj, callback) {
  request({
    url: url,
    body: template(obj),
    headers: {
      'Content-type':'text/xml'
    },
    method: 'POST'
  }, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    var out = {};
    var parser = sax.parser();
    parser.ontext = function (node) {
      out[parser.tag.name] = node;
    };
    parser.onend = function () {
      if (!('MATCHEDADDRESS' in out)) {
        return callback(new Error('address not found'));
      }
      callback(null, {
        xy: [out.X, out.Y],
        ll: [out.LONG, out.LAT],
        address: out.MATCHEDADDRESS
      });
    };
    parser.onerror = callback;
    parser.write(body).close();
  });
};