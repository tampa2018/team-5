const express = require('express');
const path = require('path');
var fs = require('fs')
var https = require('https')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require("./config.json");

var certOptions = {
  key: fs.readFileSync(path.resolve('./server.key')),
  cert: fs.readFileSync(path.resolve('./server.crt'))
}

const FACEBOOK_APP_ID = config.appId;
const FACEBOOK_APP_SECRET = config.appSecret;
const callbackURL = config.callbackURL;
const port = config.port;
var app = express();

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + '/views/home.html')
);
})

var server = https.createServer(certOptions, app).listen(port, async () => {
    console.log(`Example app listening on port ${port}!`)
})

app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
