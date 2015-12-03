/*global describe, it, expect, before */
/*jshint expr:true */

var chai = require('chai'),
    Strategy = require('..').Strategy;


describe('Strategy', function() {

  describe('handling a request with valid credentials in body using custom property names', function() {
    var strategy = new Strategy({ usernameProp: 'userid', passwordProp: 'passwd' }, function(username, password, done) {
      if (username === 'johndoe' && password === 'secret') {
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
          req.body.userid = 'johndoe';
          req.body.passwd = 'secret';
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


  describe('handling a request with valid credentials in body using custom property names with object notation', function() {
    var strategy = new Strategy({ usernameProp: 'user[username]', passwordProp: 'user.password' }, function(username, password, done) {
      if (username === 'johndoe' && password === 'secret') {
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
          req.body.user = {};
          req.body.user.username = 'johndoe';
          req.body.user.password = 'secret';
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


  describe('handling a request with valid credentials in body but using incorrect custom property names', function() {
    var strategy = new Strategy({ usernameProp: 'user', passwordProp: 'user.password' }, function(/* username, password, done */) {
      throw new Error('should not be called');
    });

    var info, status;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.headers['content-type'] = 'application/json';

          req.body = {};
          req.body.user = {};
          req.body.user.username = 'johndoe';
          req.body.user.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

});
