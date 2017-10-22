var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var UserModule = new Schema({
    name: String,
    password: String,
    phone: String,
    number: String,
    department: String,
    slat: String,
    useStatus: {type: Boolean,default: true},
    admin: {type: Boolean,default: false}
});

var User = mongoose.model('users',UserModule);

module.exports = User;