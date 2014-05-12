MassGIS geocoder
====

Node module to use [MassGIS Geocoder](https://wiki.state.ma.us/confluence/pages/viewpage.action?pageId=451772508) automatically fills in the state to Massachussetts.

From the MassGIS site

> NOTE: The MassGIS online geocoding services are intended to be used for on-the-fly addresses. If your application has the user type in the address and you don't know it ahead of time, geocode it here. If you have a set (thousands for example) of addresses already in hand, please do not send them to these services without checking with us first. Your pile of addresses can usually be faster and more accurately geocoded using desktop GIS geocoding software. These online geocoding services are shared by many users and applications and need to remain available for all users. Excessive use of geocoding services will be investigated and if the traffic cannot be managed heavy users may need to be excluded.

# Usage

```
var massgis = require('massgis');
massgis({
  address: '123 fake street',
  city: 'somewhere',
  zip: '01234'
  }, function (err, resp) {
    // either an error or
    // a response
});
//response object
var resp = {
  xy: [
    '236334.81846643778',
    '900872.79121378739'
  ],
  ll: [
    '-71.0589493288039',
    '42.357508717168777'
  ],
  address: '24 SCHOOL ST, BOSTON, MA, 02108'
};
```

response has 3 keys

- xy which is an array representing projected state plane coordinates for your address.
- ll which is an array representing longitude latitude coordiantes for your address (with longitute first geojson style).
- address which is the matched address, it is in all caps because XML is angry.