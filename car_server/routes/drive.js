var express = require('express');
var router = express.Router();

var driveModule = require('../modles/drive');
var carModule = require('../modles/car');
var userModule = require('../modles/user');
var checkToken = require('../config/token').check;

/*
 *  method: GET
 *  url: ' /checkCarNumber '
 *  params: carNumber
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/checkCarNumber',function (req,res,next){
    var _carNumber = req.query.carNumber;

    if(_carNumber){
        carModule.find({carNumber: _carNumber}).exec(function (err,result) {
            console.log(result);
           if(err){
               res.statusCode = 500;
               res.json({
                   'status': false
               });
           }
           
           if(result.length === 1){
               res.json({
                   'status': true
               });
           }else{
               res.json({
                   'status': false
               });
           }
        });
    }else{
        res.json({
            'err_Msg': 'params is wrong, Please check and try again!'
        });
    }
});

/*
 *  method: POST
 *  url: ' /drive '
 *  params: carImage & userName & useTime & userLocation & task & useStatus & carNumber &userPhone
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/drive',function (req,res,next){
    var token = req.body.token || req.query.token || req.headers['token'];

    if(checkToken(token)){
        var driveAdd = new driveModule({
            carImage: req.body.carImage,
            userNumber: req.body.userNumber,
            useTime: req.body.useTime,
            userLocation: req.body.userLocation,
            task: req.body.task,
            useStatus: req.body.useStatus    
        });
    
        driveAdd.save(function(err) {
            if(err){
                throw err;
            }else{
                userModule.find({number: req.body.userNumber}).exec(function (err,result){
                    if(err){
                        throw err;
                    }
                    var _userTarget = result[0];

                    carModule.find({carNumber: req.body.carNumber}).exec(function (err,result){
                        if(result[0].carStatus){
                            carModule.update({carNumber: req.body.carNumber},{userName: _userTarget.name,userPhone: _userTarget.phone,position: req.body.userLocation,carStatus: req.body.useStatus},function (error){
                                if(error){
                                    throw error;
                                }else{
                                    res.json({
                                        'status': 1
                                    });
                                }
                            })
                        }else{
                            res.json({
                                'status': -1
                            });
                        }
                    })
                });
            }
        })
    }else{
        res.json({
            'status': 0
        });
    }
});

/*
 *  method: GET
 *  url: ' /finishlist '
 *  params: userNumber
 *  return: finishlist { datatype: JSON && Array}
 */
router.get('/finishlist',function(req,res,next) {  
    var token = req.body.token || req.query.token || req.headers['token']; 

    if(checkToken(token)){
        driveModule.find({userNumber: req.query.userNumber}).exec(function (err,result){
            var finishlist = [];
            for(var i=0;i<result.length;i++){
               if(result[i].useStatus){
                   finishlist.push(result[i]);
               } 
            }
            res.json({
                'list': finishlist
            });
        });
    }else{
        res.json({
            'list': []
        })
    }
});

/*
 *  method: GET
 *  url: ' /unfinishlist '
 *  params: userName
 *  return: unfinishlist { datatype: JSON && Array}
 */
router.get('/unfinishlist',function (req,res,next){
    var token = req.body.token || req.query.token || req.headers['token']; 

    if(checkToken(token)){
        driveModule.find({userNumber: req.query.userNumber}).exec(function (err,result){
            var unfinishlist = [];
    
            for(var i=0;i < result.length;i++){
                if(!result[i].useStatus){
                    unfinishlist.push(result[i]);
                }
            }
            res.json({
                'list': unfinishlist
            });
        });
    }else{
        res.json({
            'list': []
        });
    }
});

/*
 *  method: GET
 *  url: ' /usefinish '
 *  params: driveId & userNumber
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/usefinish',function (req,res,next){
    var token = req.body.token || req.query.token || req.headers['token'];

    if(checkToken(token)){
        driveModule.update({_id: req.query.driveId},{useStatus: true},function (error){
            if(error){
                throw error;
            }

            userModule.find({number: req.query.userNumber}).exec(function (err,result){
                if(err){
                    throw err;
                }

                carModule.update({userName: result[0].name},{userName: '暂无',userPhone: '暂无',carStatus: true},function (error){
                    if(error){
                        throw error;
                    }else{
                        res.json({
                            'status': true
                        });
                    }    
                })
            });
        });
    }else{
        res.json({
            'status': false
        });
    }
});

module.exports = router;