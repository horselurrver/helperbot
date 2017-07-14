var express = require('express');
var router = express.Router();
var validator = require('express-validator');
var models = require('../models/models.js');

module.exports = function(passport) {

  router.get('/', function(req, res) {
    if (req.user) {
<<<<<<< HEAD
      res.redirect('/index');
    } else {
      res.redirect('/login');
=======
      //res.render('/index');
    } else {
      //res.redirect('/login')
      res.redirect('/index');
>>>>>>> 44601d0f569ce8e9b94a6bfffc48623514c558c2
    }
  });

  // path to start the OAuth flow
  router.get('/auth/slack', passport.authenticate('slack'));

<<<<<<< HEAD
  // OAuth callback url
  router.get('/auth/slack/callback',
    passport.authenticate('slack', { failureRedirect: '/login' }),
    function(req, res){
=======
  router.get('/auth/slack', passport.authenticate('slack'));
  router.get('/auth/slack/callback',
    passport.authenticate('slack', {
    failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
>>>>>>> 44601d0f569ce8e9b94a6bfffc48623514c558c2
      res.redirect('/');
    }
  );

  router.get('/login', function(req, res) {
    res.render('login');
  })

<<<<<<< HEAD
  // router.get('/index', function(req, res) {
  //   res.render('index');
  // })
=======
  router.get('/index', function(req, res) {
    res.render('index');
  });
>>>>>>> 44601d0f569ce8e9b94a6bfffc48623514c558c2


  return router;
}
