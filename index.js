'use strict';

var url = require('url');
var http = require('http');
var Handlebars = require('handlebars');
var multiline = require('multiline');
var sax = require('sax');

var endpoint = url.parse('http://gisprpxy.itd.state.ma.us/MassGISCustomGeocodeLatLongApplication/MassGISCustomGeocodeService.asmx');
endpoint.method = 'post';
endpoint.headers = {
  'Content-type':'text/xml'
};
var template = Handlebars.compile(multiline(function () {/*
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GeocodeAddress xmlns="http://tempuri.org/">
      {{#if address}}<Address>{{address}}</Address>{{/if}}
      {{#if city}}<City>{{city}}</City>{{/if}}
      {{#if zip}}<ZipCode>{{zip}}</ZipCode>{{/if}}
      <State>MA</State>
    </GeocodeAddress>
  </soap:Body>
</soap:Envelope>
*/}));


module.exports = function (obj, callback) {
  var req = http.request(endpoint, function (res) {
    if (res.statusCode !== 200) {
      return callback(new Error('address not found'));
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
        xy: [parseFloat(out.X), parseFloat(out.Y)],
        ll: [parseFloat(out.LONG), parseFloat(out.LAT)],
        address: out.MATCHEDADDRESS
      });
    };
    parser.onerror = callback;
    res.on('data', function (d) {
      parser.write(d.toString());
    });
    res.on('end', function () {
      parser.end();
    });
  }).on('error', callback);
  req.write(new Buffer(template(obj)));
  req.end();
};