var chai = require('chai');
chai.use( require('chai-passport-strategy') );

global.expect = chai.expect;


// Hack the `Request` prototype from the 'chai-passport-strategy' plugin to
// support the header retrieval mechanism used in Express
var Request = require('chai-passport-strategy/lib/request');
Request.prototype.get = function(headerName) {
  return this.headers[('' + headerName).toLowerCase()];
};
