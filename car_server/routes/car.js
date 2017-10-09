var express = require('express');
var router = express.Router();

var carModule = require('../modles/car');

/*
 *  method: POST
 *  url: ' /addcar '
 *  params: carImage & carNumber
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/addcar',function (req,res,next){
    var carData = JSON.parse(req.budy);

    var carAdd = new carModule({
        carImage: carData.carImage,
        carNumber: carData.carNumber,
        userName: '',
        userPhone: '',
        carStatus: true
    });

    carAdd.save(function (err){
        if(err){
            throw err;
        }else{
            res.json('true');
        }
    });
});

/*
 *  method: GET
 *  url: ' /carlist '
 *  params: null
 *  return: finishlist { datatype: JSON && Array}
 */
router.get('/carlist',function (req,res,next){
    driveModule.find({}).then(function (docs){
       res.json(docs); 
    });
});

module.exports = router;