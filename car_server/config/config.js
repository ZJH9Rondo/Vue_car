var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/car',{useMongoClient: true});
var db = mongoose.connection;

db.on('error',function (err){
    console.log('connection error');
});

db.once('open',function (){
    console.log('Mongo working');
});

module.exports = mongoose;