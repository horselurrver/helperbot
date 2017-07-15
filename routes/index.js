var express = require('express');
var router = express.Router();
var models = require('../models/models')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var queue = [];

router.use(function(req, res, next) {
  if (req.user) next();
  else res.redirect('/login');
})

/* GET home page. */
router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

router.get('/index', function(req, res) {
  console.log('the user: ' + req.user);
  res.render('index', {
    user: req.user.username
  });
});


router.post('/add', function(req, res) {
  var currentId = req.user._id;
  res.send(currentId);
  // add current user to the queue and send back updated queue
  // check if current user is first, if so, show the priority button
});

router.post('/cancel', function(req, res) {
  // remove current user from the queue and send back update queue
  // check if current user is first, if so, show the priority button
});

router.post('/priority', function(req, res) {

});

module.exports = router;
