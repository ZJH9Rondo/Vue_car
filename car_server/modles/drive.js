var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var driveModule = new Schema({
    carImage: Object,
    userNumber: String,
    useTime: [Schema.Types.String],
    userLocation: String,
    task: String,
    useStatus: Boolean
});

var drive = mongoose.model('drive',driveModule);

module.exports = drive;