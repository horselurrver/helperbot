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

// this render the login form if the user has not logged in yet
router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

// this render the main page
router.get('/index', function(req, res) {
  console.log("this is req.user get /index", req.user);
  res.render('index', {
    user: req.user.username
  });
});

// this adds the current user to the queue and send back the updated queue
// check if the current user is first, if so, show the priority button
router.get('/add', function(req, res) {
  queue.push(req.user); // add to the queue
  var isFirst = false;
  if (queue.indexOf(req.user) === 0)
    isFirst = true;
  var returnObj = {
    queue: queue,
    isFirst: isFirst
  }
  res.json(returnObj);
});

router.post('/cancel', function(req, res) {
  // remove current user from the queue and send back update queue
  // check if current user is first, if so, show the priority button
});

router.post('/priority', function(req, res) {

});

module.exports = router;
