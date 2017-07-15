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
    user: req.user
  });
});

// this adds the current user to the queue and send back the updated queue
// check if the current user is first, if so, show the priority button
router.post('/add', function(req, res) {
  if (req.body.category === '') {
    console.log('error');
  } else {
    Student.findById(req.user._id, function(err, student) {
      if (err) {
        res.json(err);
      } else {
        student.description = req.body.description;
        student.category = req.body.category;
        student.save(function(err, student) {
          queue.push(student);
          queue.sort(function(a, b) {
            return a.priority - b.priority;
          });
          var returnObj = {
            queue: queue,
          }
          res.json(returnObj);
        });
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
      queue.splice(i, 1);
    }
  }
 res.json({queue: queue});
});

// auto route of updating the assigning TA to student who is the front of the queue
router.get('/getAssignments', function(req, res) {
  if (queue.length >= 1) {
    Ta.find({}, function(err, tas) {
      for (var i = 0; i < tas.length; i++) {
        if (tas[i].available) {
          // pop off
          var assignedStudent = queue.shift();
          console.log("this is assignedStudent", assignedStudent);
          tas[i]["assignedTo"] = assignedStudent._id;
          tas[i]["available"] = !tas[i]["available"];
          tas[i].save();
          assignedStudent["assignedTA"] = tas[i]._id;
          assignedStudent.save();
        }        // set properties
      }
      res.json({queue: queue, tas: tas});
    });
  } else {
    Ta.find({}, function(err, tas) {
      res.json({queue: queue, tas:tas, user: req.user});
    })
  }
});

// let the ta change the status of their availability
router.post('/changeStatus', function(req, res) {
  Ta.findById(req.user._id, function(error, ta) {
    if (error) res.json(error);
    else {
      ta['available'] = ! ta['available'];
      ta.save(function(error) {
        res.json(error);
      });
    }
  });
});

// reset the queue and reset the status of the ta
router.get('/reset', function(req, res) {
  queue = [];
  Ta.find(function(err, ta) {
    if(err) {
      res.json(err);
    } else {
      ta.forEach(function(ta) {
        ta.available = true;
        ta.assignedTo = {};
        ta.save();
      });
    }
  });
});

module.exports = router;
