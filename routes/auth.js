var express = require('express');
var router = express.Router();
var validator = require('express-validator');
var models = require('../models/models.js');

module.exports = function(passport) {

  router.get('/', function(req, res) {
    if (req.user) {
      res.render('/index');
    } else {
      res.redirect('/login')
    }
  })

  router.get('/auth/slack', passport.authorize('slack'));
  router.get('/auth/slack/callback',
    passport.authorize('slack', {
    failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  router.get('/login', function(req, res) {
    res.render('login');
  })


  return router;
}
