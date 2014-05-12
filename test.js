'use strict';
var massGIS = require('./index');
massGIS({address: '24 School Street',
  zip: '02108'
}, function (a, c) {
  console.log(a, c);
});