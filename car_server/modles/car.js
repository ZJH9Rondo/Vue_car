var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var carModule = new Schema({
    carImage: String,
    carNumber: String,
    userName: String,
    userPhone: String,
    carStatus: Boolean
});

var car = mongoose.model('car',driveModule);

module.exports = car;