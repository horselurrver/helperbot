var express = require('express');
var router = express.Router();
var models = require('../models/models')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
