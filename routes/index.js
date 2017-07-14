var express = require('express');
var router = express.Router();
var models = require('../models/models')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var queue = [];

/* GET home page. */
router.get('/', function(req, res) {
  console.log("this is req.user", req.user);
  if (req.user) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/index', function(req, res) {
  res.render('index');
});

module.exports = router;
