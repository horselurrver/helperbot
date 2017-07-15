var express = require('express');
var router = express.Router();
var models = require('../models/models');
var Ta = models.Ta;
var Student = models.Student;
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
  res.render('index', {
    user: req.user.username
  });
});

// this adds the current user to the queue and send back the updated queue
// check if the current user is first, if so, show the priority button
router.post('/add', function(req, res) {
  if (req.body.category === '') {
    console.log('error');
  } else {
    Student.findByIdAndUpdate(req.user._id, {description: req.body.description, category: req.body.category}, function(error, student) {
      if (error) {
        res.json("Error in post request /add");
      } else {
        queue.push(student);
        queue.sort(function(a, b) {
          return a.priority - b.priority;
        });
        var isFirst = false;
        if (queue[0].username === req.user.username) isFirst = true;
        var returnObj = {
          queue: queue,
          isFirst: isFirst
        }
        res.json(returnObj);
      }
    });
  }
});


// remove current user from the queue and send back update queue
router.get('/cancel', function(req, res) {
  // if the student is first in line and cancel, change priority to 2
  if (queue[0].username === req.user.username) {
    Student.findByIdAndUpdate(req.user._id, {priority: 2}, function(err) {
      if (err) res.json("There's an error  in /cancel get route");
    })
  }
  // find the student and delete them from the queue
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].username === req.user.username) {
      console.log('splicing');
      queue.splice(i, 1);
      console.log('after splicing');
    }
  }
  res.json({queue: queue});
});

router.post('/priority', function(req, res) {

});

module.exports = router;
