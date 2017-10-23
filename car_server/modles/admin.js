var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var AdminModule = new Schema({
    name: String,
    email: String,
    phone: String,
    number: String,
    department: String,
    code: String,
    time: String,
    admin: {type: Boolean,default: true}
});

var Admin = mongoose.model('admins',AdminModule);

module.exports = Admin;