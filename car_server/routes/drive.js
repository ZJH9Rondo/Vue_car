var express = require('express');
var router = express.Router();

var driveModule = require('../modles/drive');
var carModule = require('../modles/car');
var userModule = require('../modles/users');

/*
 *  method: POST
 *  url: ' /drive '
 *  params: carImage & userName & useTime & userLocation & task & useStatus & carNumber &userPhone
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.post('/drive',function (req,res,next){
    var driveData = JSON.parse(req.body);

    var driveAdd = new driveModule({
        carImage: driveData.carImage,
        userName: driveData.userName,
        useTime: driveData.useTime,
        userLocation: driveData.userLocation,
        task: driveData.task,
        useStatus: driveData.status    
    });

    driveAdd.save(function(err) {
        if(err){
            throw err;
        }else{
            carModule.update({carNumber: driveData.carNumber},{userName: driveData.userName,userPhone: driveData.userPhone,carStatus: false},function (error){
                if(error){
                    throw error;
                }else{
                    res.json('true');
                }
            })
        }
    })
});

/*
 *  method: GET
 *  url: ' /finishlist '
 *  params: userName
 *  return: finishlist { datatype: JSON && Array}
 */
router.get('/finishlist',function(req,res,next) {
    var userData = JSON.parse(req.query);    

    driveModule.find({name: userData.userName}).then(function (docs){
        var finishlist = [];
        for(var i=0;i<docs.length;i++){
           if(docs[i].useStatus){
               finishlist.push(docs[i]);
           } 
        }
    });
});

/*
 *  method: GET
 *  url: ' /unfinishlist '
 *  params: userName
 *  return: unfinishlist { datatype: JSON && Array}
 */
router.get('/unfinishlist',function (req,res,next){
    var userData = JSON.parse(req.query);

    driveModule.find({name: userData.userName}).then(function (docs){
        var unfinishlist = [];

        for(var i=0;i < docs.length;i++){
            if(!docs[i].useStatus){
                unfinishlist.push(docs[i]);
            }
        }
        res.json(unfinishlist);
    });
});

/*
 *  method: GET
 *  url: ' /usefinish '
 *  params: driveId & userName
 *  return: Boolean { datatype: JSON && Boolean}
 */
router.get('/usefinish',function (req,res,next){
    var driveData = JSON.parse(req.query);

    driveModule.update({_id: driveData.id},{useStatus: true},function (error){
        carModule.update({userName: driveData.userName},{carStatus: true},function (error){
            if(error){
                throw error;
            }else{
                res.json('true');
            }    
        })
    });
});

module.exports = router;