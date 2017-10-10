var express = require('express');
var router = express.Router();

var carModule = require('../modles/car');
var checkToken = require('../config/token').check;

/*
 *  method: POST
 *  url: ' /addcar '
 *  params: carImage & carNumber
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/addcar',function (req,res,next){
    var token = req.body.token || req.query.token || req.headers['token'];

    if(checkToken(token)){
        var carAdd = new carModule({
            carImage:  req.body.carImage,
            carNumber: req.body.carNumber,
            carStatus: true
        });
    
        carAdd.save(function (err){
            if(err){
                throw err;
            }else{
                res.json({
                    'status': true
                });
            }
        });
    }else{
        res.json({
            'status': false
        });
    }
});

/*
 *  method: GET
 *  url: ' /carlist '
 *  params: null
 *  return: finishlist { datatype: JSON && Array}
 */
router.get('/carlist',function (req,res,next){
    var token = req.body.token || req.query.token || req.headers['token'];

    if(checkToken(token)){
        carModule.find({}).then(function (docs){
            res.json({
                'carlist': docs
            }); 
        });
    }else{
        res.json({
            'carlist': [] 
        });
    }
});

module.exports = router;