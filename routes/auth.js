var express = require('express');
var router = express.Router();
var validator = require('express-validator');
var models = require('../models/models.js');

module.exports = function(passport) {

  router.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/index');
    } else {
      res.redirect('/login');
    }
  });

  // path to start the OAuth flow
  router.get('/auth/slack', passport.authenticate('slack'));

  // OAuth callback url
  router.get('/auth/slack/callback',
    passport.authenticate('slack', { failureRedirect: '/login' }),
    function(req, res){
      res.redirect('/');
    }
  );

  router.get('/login', function(req, res) {
    res.render('login');
  })

  // router.get('/index', function(req, res) {
  //   res.render('index');
  // })


  return router;
}
