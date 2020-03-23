var express = require('express');
var path = require('path');
var router = express.Router();
const mongojs = require('mongojs')
require('dotenv/config');
var connectionString = process.env.DB_URL
const db = mongojs(connectionString)
const universal = db.collection('universal')

db.on('connect', function () {
  console.log('database connected')
})

/* GET users listing. */
router.get('/user/:id', function(req, res, next) {
  //console.log(process.env.DB_URL)
  //console.log(req.params.id)
  universal.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function(err, doc) {    
    if (!doc) {
      // we visited all docs in the collection
        res.jsonp({
          'status':'err',
          'message':'Not found',
          'detail':err
        })
        return
    }
    res.jsonp(doc)
  })  
});

router.get('/', function(req, res, next) {
  console.log('Login')
  res.sendFile(path.resolve('public/login.html'));
});

module.exports = router;
