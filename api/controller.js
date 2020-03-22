var express = require('express');
var path = require('path');
var router = express.Router();

/* GET users listing. */
router.get('/user/:id', function(req, res, next) {

  res.send(req.params.id)
});

router.get('/', function(req, res, next) {
  console.log('Login')
  res.sendFile(path.resolve('public/login.html'));
});

module.exports = router;
