var express = require('express');
var router = express.Router();

var User = require('../modles/user');

/*
 *  method: POST
 *  url: ' /register '
 *  params: name & password & phone & number & department
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/register', function(req, res, next) {
    var userData = JSON.parse(req.query);

    var UserAdd = new User({
      name: userData.name,
      password: userData.password,
      phone: userData.phone,
      number: userData.number,
      department: userData.department
    });

    UserAdd.save(function(err) {
      if(err){
        throw err;
      }else{
        res.send('true');      
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
    var userData = JSON.parse(req.query);

    User.find({number: '04152112'}).then(function(docs) {
      if(doc[0].password === userData.password){
        res.json('true');
      }else{
        res.json('false');
      } 
    }); 
});

module.exports = router;
