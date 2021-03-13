const mongojs = require('mongojs')
require('dotenv/config');
var express = require('express');
var path = require('path');
var router = express.Router();

//Banco
var connectionString = process.env.DB_URL
console.log(connectionString)
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
  
  router.post('/api/signin', function(req,res,next){
    if(req.body.email && req.body.pass){
      universal.findOne({
        email: req.body.email
      }, function(err, doc) {    
        if (!doc) {
          // we visited all docs in the collection
            res.jsonp({
              'status':'err',
              'message':'Email não cadastrado!',
              'detail':err
            })
            return
        }else{
          if(doc.pass == req.body.pass){
            doc.pass = '';
            res.jsonp({
              'status':'ok',
              'message':'',
              'doc':doc
            })
          }else{
            res.jsonp({
              'status':'err',
              'message':'Senha inválida'
            })
          }
        }      
      }) 
    }else{
      res.jsonp({
        'status':'err',
        'message':'Invalid Parameter'      
      })
    }
  })
  
  router.post('/api/signup', function(req,res,next){
    if(req.body.email && req.body.pass && req.body.name&&req.body.last){        
      universal.findOne({
        email: req.body.email
      }, function(err, doc) {    
        if (!doc) {
          universal.insert(req.body,function(err,data){
            if(err){
              res.jsonp({
                'status':'err',
                'message':'Tente novamente mais tarde',
                'detail':err
              })
            }else{
              data.pass = '';
              res.jsonp({
                'status':'ok',
                'message':'',              
                'doc':data
              })
            }
          })
            
        }else{        
          res.jsonp({
            'status':'err',
            'message':'Usuário já cadastrado'
          })        
        }      
      }) 
    }else{
      res.jsonp({
        'status':'err',
        'message':'Invalid Parameter'      
      })
    }
  })
  

module.exports = router;