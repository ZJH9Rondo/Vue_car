var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var carModule = new Schema({
    carImage: String,
    carNumber: String,
    userName: {type: String,default: '暂无'},
    userPhone: {type: String,default: '暂无'},
    carStatus: Boolean
});

var car = mongoose.model('car',carModule);

module.exports = car;