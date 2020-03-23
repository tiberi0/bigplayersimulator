//requires
const mongojs = require('mongojs')
require('dotenv/config');
var express = require('express');
var path = require('path');
var router = express.Router();

//Banco
var connectionString = process.env.DB_URL
const db = mongojs(connectionString)
const universal = db.collection('universal')

db.on('connect', function () {
  console.log('database connected')
})



router.get('/', function(req, res, next) {
  //console.log('Login')
  res.sendFile(path.resolve('public/login.html'));
});

router.get('/forgotpassword', function(req, res, next) {
  //console.log('Login')
  res.sendFile(path.resolve('public/forgot-password.html'));
});

router.get('/register', function(req, res, next) {
  //console.log('Login')
  res.sendFile(path.resolve('public/register.html'));
});

router.get('/dashboard', function(req, res, next) {
  //console.log('Login')
  res.sendFile(path.resolve('public/dashboard.html'));
});

//Rota geral
router.post('/',function(req,res,next){
  var token = '';
  if(req.body){
    if(req.body.token){
      var idOb = '';
      try{
        idOb = mongojs.ObjectId(req.body.token)
      }catch(err){
        res.jsonp({
          'status':'err',
          'message':'Authentite failed',
          'detail':'Token inválido'
        })
        return
      }
      universal.findOne({
        _id: idOb
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
    }else{
      res.jsonp({
        'status':'err',
        'message':'Authentite failed',
        'detail':'Token expirou'
      })
    }
  }else{
    res.jsonp({
      'status':'err',
      'message':'Authentite failed',
      'detail':'Token expirou'
    })
  }  
})
///////////////////////////////////////////API////////////////////////////
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

module.exports = router;
