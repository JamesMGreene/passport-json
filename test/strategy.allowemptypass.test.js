/*global describe, it, expect, before */
/*jshint expr:true */

var chai = require('chai'),
    Strategy = require('..').Strategy;


describe('Strategy', function() {

  describe('handling a request with valid credentials (including password of empty string) in body and JSON content type, with allowEmptyPasswords enabled', function() {
    var strategy = new Strategy({ allowEmptyPasswords: true }, function(username, password, done) {
      if (username === 'johndoe' && password === '') {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false);
    });

    var user, info;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.headers['content-type'] = 'application/json';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = '';
        })
        .authenticate();
    });

    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('1234');
    });

    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.scope).to.equal('read');
    });
  });

});
