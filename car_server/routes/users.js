var express = require('express');
var router = express.Router();

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
  var flag = Token.check(token);
  
  if(flag){
    console.log(flag);
    res.json({
      'status': true
    });
  }else{
    console.log(flag);
    res.json({
      'status': false
    });
  }
});

/*
 *  method: POST
 *  url: ' /register '
 *  params: name & password & phone & number & department
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/register', function(req, res, next) {
    var UserAdd = new User({
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
      number: req.body.number,
      department: req.body.department
    });

    UserAdd.save(function(err) {
      if(err){
        throw err;
        res.json({
          'status': false
        })
      }else{
        res.json({
          'status': true
        });      
      }
    });
});

/*
 *  method: GET
 *  url: ' /login '
 *  params: number & password
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/login',function(req,res,next) {
    User.find({number: req.query.user}).exec(function(err,result) {
      if(result[0].password === req.query.password){
        var _token = Token.crate();

        console.log(_token);
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

module.exports = router;
