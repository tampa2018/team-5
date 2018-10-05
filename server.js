const express = require('express');
const path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require("./config.json");

const FACEBOOK_APP_ID = config.appId;
const FACEBOOK_APP_SECRET = config.appSecret;
const callbackURL = config.callbackURL;
const port = config.port;
var app = express();



app.get('/', async (req, res) => {
    res.send('hello world!');
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}!`)
})


