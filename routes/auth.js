var express = require('express');
var router = express.Router();
var validator = require('express-validator');
var models = require('../models/models.js');

module.exports = function(passport) {

  router.get('/auth/slack', passport.authenticate('slack'));
  router.get('/auth/slack/callback',
    passport.authenticate('slack', {
    failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );


  return router;
}
