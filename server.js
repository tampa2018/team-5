const express = require('express');
const path = require('path');
var fs = require('fs')
var https = require('https')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;


var config = require("./config.json");

var certOptions = {
  key: fs.readFileSync(path.resolve('build/cert/server.key')),
  cert: fs.readFileSync(path.resolve('build/cert/server.crt'))
}

const FACEBOOK_APP_ID = config.appId;
const FACEBOOK_APP_SECRET = config.appSecret;
const GOOGLE_CLIENT_ID = config.conKey;
const GOOGLE_CLIENT_SECRET = config.conSecret;
const callbackURL = config.callbackURL;
const port = config.port;
var app = express();

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//Home Page
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + '/views/home.html')
);
})

//About Us
app.get('/aboutus.html', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/aboutus.html'));
});

//News
app.get('/news.html', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/news.html'));
});

//Report
app.get('/report.html', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/news.html'));
});

//Server Create
var server = https.createServer(certOptions, app).listen(port, async () => {
    console.log(`Example app listening on port ${port}!`)
})



//Facebook Auth
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/',
failureRedirect: '/login' }));

//Google Auth
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
