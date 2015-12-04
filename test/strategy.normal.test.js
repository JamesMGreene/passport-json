/*global describe, it, expect, before */
/*jshint expr:true */

var chai = require('chai'),
    Strategy = require('..').Strategy;


describe('Strategy', function() {

  describe('handling a request with valid credentials in body and JSON content type', function() {
    var strategy = new Strategy(function(username, password, done) {
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
          req.body.username = 'johndoe';
          req.body.password = 'secret';
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


  describe('handling a request with valid credentials in body and JSON content type with a UTF charset', function() {
    var strategy = new Strategy(function(username, password, done) {
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
          req.headers['content-type'] = 'application/json; charset=utf-8';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
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


  describe('handling a request with valid credentials in body and JSON content type with a UTF charset in all uppercase', function() {
    var strategy = new Strategy(function(username, password, done) {
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
          req.headers['content-type'] = 'APPLICATION/JSON; CHARSET=UTF-8';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
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


  describe('handling a non-Express request with valid credentials in body and JSON content type', function() {
    var strategy = new Strategy(function(username, password, done) {
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
          // Delete the `get` function property for this single request instance
          delete req.get;

          req.headers['content-type'] = 'application/json';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
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


  describe('handling a request with valid credentials in body but without any content type', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Unacceptable content type');
      expect(status).to.equal(415);
    });
  });


  describe('handling a request with valid credentials in body but with a non-JSON content type', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.headers['content-type'] = 'application/x-www-form-urlencoded';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Unacceptable content type');
      expect(status).to.equal(415);
    });
  });


  describe('handling a request with valid credentials in body and JSON content type but with a non-UTF charset', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.headers['content-type'] = 'application/json; charset=iso-8859-1';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Unacceptable content type');
      expect(status).to.equal(415);
    });
  });


  describe('handling a request without a body', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but no username and password', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but no password', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.username = 'johndoe';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but null password', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.username = 'johndoe';
          req.body.password = null;
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but empty password', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.username = 'johndoe';
          req.body.password = '';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but no username', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but null username', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.username = null;
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with a body, but empty string username', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.username = '';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });


  describe('handling a request with valid credentials in body but stored within unexpected custom property names', function() {
    var strategy = new Strategy(function(/* username, password, done */) {
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
          req.body.usernameAlternateProp = 'johndoe';
          req.body.passwordAlternateProp = 'secret';
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
