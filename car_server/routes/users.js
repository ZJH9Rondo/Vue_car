var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var User = require('../modles/user');
var Admin = require('../modles/admin');
var Token = require('../config/token');

/*
 *  method: GET
 *  url: ' /checktoken '
 *  params: token
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/checktoken', function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['token'];
  var msg = Token.check(token);

  User.findOne({ number: msg }).exec(function (err, result) {
    if (err || !result) {
      res.json({
        'status': false
      });
    } else {
      res.json({
        'status': true
      });
    }
  });
});

/*
 *  method: GET
 *  url: ' /sendCode '
 *  params: user
 *  return: Number { datatype: JSON && Number}
 */
router.get('/sendCode', function (req, res, next) {
  Admin.find({ number: req.query.user }).exec(function (err, result) {
    if (err) {
      throw err;
      res.statusCode = 500;
      res.end();
    }

    if (result.length === 0) {
      res.json({
        'status': 0
      })
    } else {
      // 生成验证码
      var _code = '',
          rand = (function (number) {
            var today = new Date();
            var seed = today.getTime();
            function rnd() {
              seed = (seed * 9301 + 49297) % 233280;
              return seed / (233280.0);
            };
            return function rand(number) {
              return Math.ceil(rnd() * number);
            };
          })();

      (function createCode() {
        for (var i = 1; i < 6; i++) {
          if (i % 2 === 0) {
            _code += rand(i);
          } else {
            _code += rand(10 - i);
          }
        }
      })();

      // 验证码邮件发送配置
      var transporter = nodemailer.createTransport({
            service: 'qq',
            auth: {
              user: '1908152767@qq.com',
              pass: 'jfdlhhkjbusoebfc'
            }
          }),
          _html = '<p>尊敬的管理员用户您好：</p><p>这是一封来自政府公车内部管理平台的验证码邮件，由于您登录请求验证码，所以您会收到这封邮件，请您放心，这封邮件是安全邮件，没有恶意链接或广告注入，下面是验证码正文，您可以在有效时间内填写此验证码登录该平台。</p>' +
          '<h2>验证码</h2><h3>' + _code + '</h3>',
          mailOptions = {
            from: '1908152767@qq.com',
            to: result[0].email,
            subject: '政府公车管理平台',
            html: _html
          };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          res.json({
            'status': -1
          });
        }

        Admin.update({ number: req.query.user }, { code: _code ,time: Date.parse(new Date())}, function (error) {
          if (error) {
            res.json({
              'status': -2
            });
          }

          res.json({
            'status': 1
          });
        });
      });
    }
  })
});

/*
 *  method: GET
 *  url: ' /checkAdmin '
 *  params: user
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/checkAdmin', function (req, res, next) {
  Admin.find({ number: req.query.user }).exec(function (err, result) {
    if (err) {
      res.statusCode = 500;
      res.end();
    }

    if (result.length === 1) {
      res.json({
        'status': true
      });
    } else {
      res.json({
        'status': false
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
router.post('/register', function (req, res, next) {
  var md5 = crypto.createHash('md5');
  var slat = md5.update('ZJH9Rondo@github.com').digest('hex');
  var hmac = crypto.createHmac('sha256', slat); // 密码加密存储
  req.body.password = hmac.update(req.body.password).digest('hex');

  User.find({ number: req.body.number }).exec(function (err, result) {
    if (err) {
      throw err;
    }

    if (result.length === 0) {
      var UserAdd = new User({
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone,
        number: req.body.number,
        department: req.body.department,
        slat: slat
      });

      UserAdd.save(function (err) {
        if (err) {
          throw err;
          res.json({
            'status': 0
          })
        } else {
          res.json({
            'status': 1
          });
        }
      });
    } else {
      res.json({
        'status': -1
      })
    }
  });
});

/*
 *  method: GET
 *  url: ' /userlogin '
 *  params: number & password
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/login', function (req, res, next) {
  User.find({ number: req.body.user }).exec(function (err, result) {
    var hmac = crypto.createHmac('sha256', result[0].slat);
    req.body.password = hmac.update(req.body.password).digest('hex');

    if (result[0].password === req.body.password) {
      var _token = Token.crate(req.body.user);

      res.json({
        'token': _token,
        'status': true
      })
    } else {

      res.json({
        'status': false
      });
    }
  });
});

/*
 *  method: GET
 *  url: ' /rootlogin '
 *  params: user & code
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/rootlogin',function (req,res,next){
  Admin.find({number: req.query.user}).exec(function (err,result){
    if(err){
      throw err;
      res.statusCode = 500;
      res.json({
        'status': -3
      });
    }

    if(result[0].admin){
      if(((Date.parse(new Date()) / 1000) - (Number(result[0].time) / 1000)) < 63){
        if(req.query.code === result[0].code){
          var _token = Token.crate(req.query.user);

          res.json({
            'token': _token,
            'status': 1
          });
        }else{
          res.json({
            'status': 0
          })
        }
      }else{
        Admin.update({number: req.query.user},{code: '',time: ''},function (error){
          if(error){
            throw error;
            res.statusCode = 500;
            res.json({
              'status': -3
            });
          }

          // 验证码过期
          res.json({
            'status': -1   
          });
        })
      }
    }else{
      // 非管理员账号
      res.json({
        'status': -2
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
router.post('/changePwd', function (req, res, next) {
  User.find({ number: req.body.number }).exec(function (err, result) {
    if (err) {
      res.statusCode = 500;
      res.end();
    }

    if (result.length === 0) {
      res.json({
        'status': 0
      })
    } else {
      var _oldhmac = crypto.createHmac('sha256', result[0].slat);
      req.body.oldPassword = _oldhmac.update(req.body.oldPassword).digest('hex');

      if (req.body.oldPassword === result[0].password) {
        var _newhmac = crypto.createHmac('sha256', result[0].slat);
        req.body.newPassword = _newhmac.update(req.body.newPassword).digest('hex');

        User.update({ number: req.body.number }, { password: req.body.newPassword }, function (error, docs) {
          if (error) {
            throw error;
            res.statusCode = 500;
            res.end();
          }

          Admin.findOne({number: req.body.number}).exec(function (err,result){
            if(err){
              throw err;
            }

            if(result.admin){
              res.json({
                'status': -2
              });
            }else{
              var _token = Token.crate(req.body.user);
              res.json({
                'token': _token,
                'status': 1
              });
            }
          });
        });
      } else {
        res.json({
          'status': -1
        });
      }
    }
  });
});

module.exports = router;
