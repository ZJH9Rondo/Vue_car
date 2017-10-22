var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('../modles/user');
var Token = require('../config/token');

/*
 *  method: GET
 *  url: ' /checktoken '
 *  params: token
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/checktoken',function(req,res,next){
  var token = req.body.token || req.query.token || req.headers['token'];
  var msg = Token.check(token);

  User.findOne({number: msg}).exec(function (err,result){
      if(err || !result){
          res.json({
            'status': false
          });
      }else{
          res.json({
            'status': true
          });
      }   
  });
});

/*
 *  method: POST
 *  url: ' /register '
 *  params: name & password & phone & number & department
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/register', function(req, res, next) {
    var md5 = crypto.createHash('md5');
    var slat = md5.update('ZJH9Rondo@github.com').digest('hex');
    var hmac = crypto.createHmac('sha256',slat); // 密码加密存储
    req.body.password = hmac.update(req.body.password).digest('hex');

    User.find({number: req.body.number}).exec(function (err,result){
        if(err){
          throw err;
        }
        
        if(result.length === 0){
            var UserAdd = new User({
              name: req.body.name,
              password: req.body.password,
              phone: req.body.phone,
              number: req.body.number,
              department: req.body.department,
              slat: slat
            });
        
            UserAdd.save(function(err) {
              if(err){
                throw err;
                res.json({
                  'status': 0
                })
              }else{
                res.json({
                  'status': 1
                });      
              }
            });
        }else{
          res.json({
            'status': -1
          })
        }
    });
});

/*
 *  method: GET
 *  url: ' /login '
 *  params: number & password
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/login',function(req,res,next) {  
    User.find({number: req.body.user}).exec(function(err,result) {
      var hmac = crypto.createHmac('sha256',result[0].slat);
      req.body.password = hmac.update(req.body.password).digest('hex');
      
      console.log(req.body.password);
      if(result[0].password === req.body.password){
        var _token = Token.crate(req.body.user);

        res.json({
          'token': _token,
          'status': true 
        })
      }else{
        
        res.json({
          'status': false
        });
      } 
    }); 
});

/*
 *  method: POST
 *  url: ' /changePwd '
 *  params: number & oldPassword & newPassword
 *  return: 1/-1/0 { datatype: Number}
 */
router.post('/changePwd',function(req,res,next) {
    User.find({number: req.body.number}).exec(function (err,result) {
       if(err){
         res.statusCode = 500;
         res.end();
       }
       
       if(result.length === 0){
          res.json({
            'status': 0
          })
       }else{
          var _oldhmac = crypto.createHmac('sha256',result[0].slat);
          req.body.oldPassword = _oldhmac.update(req.body.oldPassword).digest('hex');

          if(req.body.oldPassword === result[0].password){
              var _newhmac = crypto.createHmac('sha256',result[0].slat);
              req.body.newPassword = _newhmac.update(req.body.newPassword).digest('hex');

              User.update({number: req.body.number},{password: req.body.newPassword},function (error,docs){
                  if(error){
                    throw error;
                    res.statusCode = 500;
                    res.end();
                  }

                  var _token = Token.crate(req.body.user);
                  res.json({
                    'token': _token,
                    'status': 1
                  });
              });
          }else{
            res.json({
              'status': -1
            });
          }
       }
    });
});

module.exports = router;
