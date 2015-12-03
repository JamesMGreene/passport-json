/*global describe, it, expect */

var Strategy = require('..').Strategy;


describe('Strategy', function() {

  var strategy = new Strategy(function() {});

  it('should be named "json"', function() {
    expect(strategy.name).to.equal('json');
  });

  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      /*jshint unused:false */
      var s = new Strategy();
    }).to.throw(TypeError, 'JsonStrategy requires a verify callback');
  });

});
