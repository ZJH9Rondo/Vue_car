var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var driveModule = new Schema({
    carImage: String,
    userName: String,
    useTime: String,
    userLocation: String,
    task: String,
    useStatus: Boolean
});

var drive = mongoose.model('drive',driveModule);

module.exports = drive;