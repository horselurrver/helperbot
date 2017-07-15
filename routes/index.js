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
router.get('/add', function(req, res) {
  if (req.body.category.length === 0) {
    res.json("Category is empty");
  } else {
    Student.findByIdAndUpdate(req.user._id, {description: req.body.description, category: req.body.category}, function(error, student) {
      if (queue.length === 0 || queue.length === 1) {
        queue.push(student);
      } else {
        queue.push(student);
        var key;
        for (var j = 1; j < queue.length; j++) {
          key = queue[j].priority;
          var i = j - 1;
          while (i >= 1 && queue[i].priority > key) {
            queue[i + 1] = queue[i];
            i = i - 1;
          }
          queue[i + 1] = key;
        }
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
// check if current user is first, if so, show the priority button
router.post('/cancel', function(req, res) {
  if ()
});

//
router.post('/priority', function(req, res) {

});

module.exports = router;
