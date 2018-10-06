const express = require('express');
const path = require('path');
var fs = require('fs')
var https = require('https')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');
// Retrieve
var MongoClient = require('mongodb').MongoClient;

var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  fb_id: Number,
  google_id: Number,
  fname: {type: String, required: true},
  lname: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: Number, required: true},
  user_type: {type: String, required: true},
  createdon: {type: Date, required: true}
});

var postsSchema = new Schema({
  id: {type: Number, required: true},
  user_id: {type: Number, required: true},
  message: {type: Number, required: true},
  likes: {type: Number, required: true},
  dislikes: {type:Number, required: true},
  topics: {type: String, required: true},
  reports: {type: Number, required: true},
  post_type: {type: String, required: true},
  createdOn: {type: Date, required: true}
});

var commentsSchema = new Schema({
  id: {type: Number, required: true},
  user_id: {type: Number, required: true},
  post_id: {type: Number, required: true},
  message: {type: Number, required: true},
  likes: {type: Number, required: true},
  dislikes: {type:Number, required: true},
  reports: {type: Number, required: true},
  post_type: {type: String, required: true},
  createdOn: {type: Date, required: true}
});

var ratingSchema = new Schema({
  id: {type: Number, required: true},
  user_id: {type: Number, required: true},
  post_id: {type: Number, required: true},
  type: {type: String, required: true}
})
async function getUser(id){

};

async function getPost(id){

};

async function getComment(id){

};

async function getPostRating(id){
  // rating = likes - dislikes
};

async function getCommentRating(id){
  // rating = likes - dislikes
};

async function getUserLikes(id){

};

async function createUserFacebook(fb_id, fname, lname, email, phone, user_type, createdOn){

};

async function createUserGoogle(google_id, fname, lname, email, phone, user_type, createdOn){

};

async function createPost(user_id, message, topic){

};

async function createComment(user_id, post_id, message){

};

async function addLikePost(user_id, post_id){

};

async function addDislikePost(user_id, post_id){

};

async function addLikeComment(user_id, comment_id){

};

async function addDislikeComment(user_id, comment_id){

};

async function addReportPost(user_id, post_id){

};

async function addReportComment(user_id, post_id){

};

var UserData = mongoose.model('UserData', userDataSchema)



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
