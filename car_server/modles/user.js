var mongoose = require('../config/config');
var Schema = mongoose.Schema;

var UserModule = new Schema({
    name: String,
    password: String,
    phone: String,
    number: String,
    department: String,
    useStatus: Boolean
});

var User = mongoose.model('users',UserModule);

module.exports = User;