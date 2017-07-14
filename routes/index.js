var express = require('express');
var router = express.Router();
var models = require('../models/models')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var queue = [];

/* GET home page. */
router.get('/', function(req, res) {
<<<<<<< HEAD
  console.log("this is req.user", req.user);
=======
  console.log('req.user: ' + req.user);
>>>>>>> ea72fa61e08e1ff54cdcc18a5b396b99f555262b
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
  res.render('index', {
    user: req.user
  });
});

<<<<<<< HEAD
=======
router.get('/logout', function(req, res) {
  console.log('user: ' + req.user);
  req.logout();
  res.redirect('/login');
});

router.post('/add', function(req, res) {
  
});

>>>>>>> ea72fa61e08e1ff54cdcc18a5b396b99f555262b
module.exports = router;
