const express = require('express');
const path = require('path');
var fs = require('fs')
var https = require('https')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var pg = require('pg')
var config = require("./config.json");
var db_config = require("./db_config.json")
var bodyParser = require('body-parser');
const { Pool } = require('pg');

// pools will use environment variables
// for connection information
const pool = new Pool(db_config);



async function getUser(id){
  var response = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  var rows = response.rows;
  return rows;
};

async function getPost(id){
  var post = await postsSchema.findByID(id);
  return await post
};

async function getComment(id){
  var comment = await postsSchema.findByID(id);
  return await comment
};

async function getPostRating(id){
  // rating = likes - dislikes
  var likes = await postsSchema.find("likes");
};

async function getCommentRating(id){
  // rating = likes - dislikes
};

async function getUserLikes(id){

};

async function getAllPosts(){
  var result = await pool.query('SELECT * FROM codeforgood.posts INNER JOIN codeforgood.users ON users.id = posts.user_id;')
  var rows = result.rows;
  return rows;
}

async function createUserFacebook(fb_id, fname, lname, email, phone, user_type){
  await pool.query(`INSERT INTO codeforgood.users(fb_id, google_id, fname, lname, email, user_type) 
  VALUES($1, $2, $3, $4, $5, $6, $7, $8);`,
  [fb_id, null, fname, lname, zipcode, email, phone, user_type]);
};

async function createUserGoogle(google_id, fname, lname, email, phone, user_type){
  await pool.query(`INSERT INTO codeforgood.users(fb_id, google_id, fname, lname, email, user_type) 
  VALUES($1, $2, $3, $4, $5, $6, $7, $8);`,
  [fb_id, null, fname, lname, zipcode, email, phone, user_type, createdOn]);
};

async function createPost(user_id, message, topic){
  await pool.query(`INSERT INTO codeforgood.posts(user_id, message, topic)
  VALUES($1, $2, $3)`, [user_id, message, topic]);
};

async function createComment(user_id, post_id, message){
  await pool.query(`INSERT INTO codeforgood.comments(post_id, user_id, message)
  VALUES($1, $2, $3)`, [post_id, user_id, message]);
};

async function addLikePost(user_id, post_id){
  var currentLikes = await pool.query(`select likes from codeforgood.posts where post_id=$1;`, [post_id]);
  await pool.query('UPDATE codeforgood.posts SET likes = $1;', [currentLikes+1]);
  await pool.query('INSERT INTO codeforgood.ratings(user_id, post_id, type) VALUES()')
};

async function addDislikePost(user_id, post_id){
  var currentDislikes = await pool.query(`select dislikes from codeforgood.posts where post_id=$1;`, [post_id]);
  await pool.query('UPDATE codeforgood.posts SET dislikes = $1;', [currentDislikes+1]);
};

async function addLikeComment(user_id, comment_id){
  var currentLikes = await pool.query(`select likes from codeforgood.comments where comment_id=$1;`, [comment_id]);
  await pool.query('UPDATE codeforgood.comments SET likes = $1;', [currentLikes+1]);
};

async function addDislikeComment(user_id, comment_id){
  var currentDislikes = await pool.query(`select dislikes from codeforgood.posts where comment_id=$1;`, [comment_id]);
  await pool.query('UPDATE codeforgood.comments SET dislikes = $1;', [currentDislikes+1]);
};

async function addReportPost(user_id, post_id){

};

async function addReportComment(user_id, post_id){

};

async function getMaxId(){

};





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


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded())

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
  console.log(await pool.query('SELECT * FROM codeforgood.rating;'));
  console.log('WE MADE IT');
  res.sendFile(path.join(__dirname + '/views/home.html')
);
})

app.get('/allPosts', async(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json(await getAllPosts());
})
//User Functions

//FB User Create
app.get('/fb_account/create', async (req, res) => {
  console.log('request recieved');
  var userInit = {
    "fb_id": 1,
    "fname": 'jam',
    "lname": 'cav',
    "email": 'k@c.com',
    "phone": 12345,
    "user_type": 'admin',
  }
  res.send('hello');
  //var newUser = await createUserFacebook(id, fb_id, fname, lname, email, phone, user_type, createdOn);
  //console.log('New Facebook User Created: ');
  //console.log(newUser);
  //res.send('working');
});

//Google User Create
app.post('/google_account/create', async (req, res) => {
  var id = await (getMaxId() + 1);
  var fb_id= req.query.fb_id;
  var fname= req.query.fname;
  var lname= req.query.lname;
  var email= req.query.email;
  var phone= req.query.phone;
  var user_type= req.query.user_type;
  var createdOn= req.query.createdOn;
  var newUser = await createUserFacebook(id, fb_id, fname, lname, email, phone, user_type, createdOn);
  console.log('New Facebook User Created: ');
  console.log(newUser);
});



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
  res.sendFile(path.join(__dirname + '/views/reportstab.html'));
});

//Server Create
var server = https.createServer(certOptions, app).listen(port, async () => {
    console.log(`Example app listening on port ${port}!`)
})



//Facebook Auth
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', async (req, res) => {
  passport.authenticate('facebook', { successRedirect: '/',
  failureRedirect: '/login' }, async (req, res) => {
    console.log(req)
  });
})

//Google Auth
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/addPost', async(req,res) =>{
  res.redirect('https://localhost:3000/nextpage.1.html');
})

app.get('/login.html', async(req,res) =>{
  res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/homepage2.html', async(req,res) =>{
  res.sendFile(path.join(__dirname + '/views/homepage2.html'));
})

app.get('/loggedout.html', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/loggedout.html'));
})
app.get('/nextpage.1.html', async (req, res) =>{
  res.sendFile(path.join(__dirname + '/views/nextpage.1.html'));
})
app.post('/addPost', async(req, res) => {
  console.log(req.body);
  var user_id = 17; 
  var fname = "Sebastian";
  var lname = "Bertreand";
  var topic = req.body.topic;
  var message = req.body.comments;
  await pool.query('INSERT INTO codeforgood.posts(user_id, topic, message) VALUES( $1, $2, $3);', 
  [user_id, topic, message]);
  res.redirect('/addPost');
})



app.get('/img/logo1.png', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/logo1.png'));
})

app.get('/img/logo2.png', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/logo2.png'));
})
app.get('/images/logo1.png', async(req, res) => {
  res.sendFile(path.join(__dirname + '/images/logo1.png'));
})
app.get('/images/NYC.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/images/NYC.jpg'));
})

app.get('/images/logo2.png', async(req, res) => {
  res.sendFile(path.join(__dirname + '/images/logo2.png'));
})
app.get('/img/Rebecca.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/Rebecca.jpg'));
})

app.get('/img/Sarah.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/Sarah.jpg'));
})

app.get('/img/Alia.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/Alia.jpg'));
})

app.get('/img/Joan.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/Joan.jpg'));
})

app.get('/img/slider_1.jpg', async(req, res) => {
  res.sendFile(path.join(__dirname + '/views/img/slider_1.jpg'));
})