var jwt = require('jsonwebtoken');
var content = { msg: "goverment car sign in control" };
var secretOrPrivateKey = "createByZJH9Rondo";

var token= {
    crate: function (){
        var token = jwt.sign(content,secretOrPrivateKey,{expiresIn: '192h'});
        return token;
    },
    check: function (_token){
        var flag;
        jwt.verify(_token,secretOrPrivateKey,function (err,decoded){
            console.log(decoded);
            flag = decoded.msg == 'goverment car sign in control' ? true : false;
        });
        return flag;
    }    
}

module.exports = token;