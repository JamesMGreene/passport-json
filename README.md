# passport-json
[![GitHub Latest Release](https://badge.fury.io/gh/JamesMGreene%2Fpassport-json.svg)](https://github.com/JamesMGreene/passport-json) [![Build Status](https://secure.travis-ci.org/JamesMGreene/passport-json.svg?branch=master)](https://travis-ci.org/JamesMGreene/passport-json) [![Coverage Status](https://coveralls.io/repos/JamesMGreene/passport-json/badge.svg?branch=master&service=github)](https://coveralls.io/github/JamesMGreene/passport-json?branch=master) [![Dependency Status](https://david-dm.org/JamesMGreene/passport-json.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/passport-json) [![Dev Dependency Status](https://david-dm.org/JamesMGreene/passport-json/dev-status.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/passport-json#info=devDependencies)


A [Passport][] strategy for username/password authentication via JSON from the request body.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Passport, JSON authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect][]-style middleware, including
[Express][].


## Install

```shell
$ npm install passport-json
```


## Usage

### Prerequisites

Before you can use this strategy, you _MUST_ ensure that your request (`req`) object always has a `body` property that is populated appropriately with parsed JSON.

For example, if you are using Passport and this strategy within Express `4.x` or above, you would want to set up the [`'body-parser'` middleware](https://www.npmjs.com/package/body-parser) to parse the request body's JSON before setting up the Passport middleware:

```js
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
```


### Configure Strategy

The JSON authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

```js
var JsonStrategy = require('passport-json').Strategy;

passport.use(new JsonStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

#### Available Options

This strategy takes an optional options hash before the `verify` function, e.g. `new JsonStrategy(/* { options }, */ verify)`.

The available options include:

 - `usernameProp` - Optional, defaults to `'username'`
 - `passwordProp` - Optional, defaults to `'password'`
 - `passReqToCallback` - Optional, defaults to `false`
 - `allowEmptyPasswords` - Optional, defaults to `false`


##### Using Those Options

###### `usernameProp`
###### `passwordProp`

By default, the `JsonStrategy` expects to find credentials in JSON properties named `'username'` and `'password'`, e.g.:

```json
{
  "username": "JamesMGreene",
  "password": "Th3 8e57 p@$sw0rd 3v4r"
}
```

If your app prefers to name these properties differently, the `usernameProp` and `passwordProp` options are available to change the defaults:

```js
passport.use(new JsonStrategy(
  {
    usernameProp: 'email',
    passwordProp: 'passwd'
  },
  function(username, password, done) {
    // ...
  }
));
```

Additionally, if your app prefers to have these properties be nested within other object(s), the `usernameProp` and `passwordProp` options are available to support that using either dot or bracket [minus the quotes] notation as well:

```js
passport.use(new JsonStrategy(
  {
    usernameProp: 'user.email',
    passwordProp: 'user[passwd]'
  },
  function(username, password, done) {
    // ...
  }
));
```


###### `passReqToCallback`

The `verify` callback can be supplied with the `request` object _as the first argument_ by setting the `passReqToCallback` option to `true`, and changing the expected callback parameters accordingly. This may be useful if you also need access to the request's HTTP headers. For example:

```js
passport.use(new JsonStrategy(
  {
    usernameProp: 'email',
    passwordProp: 'passwd',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    // request object is now first argument
    // ...
  }
));
```


###### `allowEmptyPasswords`

By setting the `allowEmptyPasswords` option to `true`, passwords of empty string (`''`) will be allowed to pass the validation checks. For example:

```js
passport.use(new JsonStrategy(
  {
    allowEmptyPasswords: false
  },
  function(username, password, done) {
    // ...
  }
));
```


### Authenticating Requests

Use `passport.authenticate('json')` to specify that you want to employ the configured `'json'` strategy to authenticate requests.

For example, as route middleware in an [Express][] application:

```js
app.post(
  '/login', 
  passport.authenticate('json', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);
```


## License

Copyright (c) 2015, James M. Greene (MIT License)



<!--- RESOURCE LINKS -->

[Passport]: http://passportjs.org/
[Connect]: http://www.senchalabs.org/connect/
[Express]: http://expressjs.com/
