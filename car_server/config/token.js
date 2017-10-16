var jwt = require('jsonwebtoken');
var secretOrPrivateKey = "createByZJH9Rondo";

var token= {
    crate: function (userNumber){
        var token = jwt.sign({msg: userNumber},secretOrPrivateKey,{expiresIn: '192h'});
        return token;
    },
    check: function (_token){
        var msg = jwt.verify(_token,secretOrPrivateKey,function (err,decoded){
            if(err){
                throw err;
            }else{
                return decoded.msg;
            }
        });     

        return msg;
    }    
}

module.exports = token;