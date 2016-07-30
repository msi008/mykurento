var OAuth = require('wechat-oauth'),
    oauth = require('../config/oauth')
var option = oauth.wechat;
var client = new OAuth(option.appid, option.secret);
exports.wxoauth = function(req,res){
    var url = client.getAuthorizeURLForWebsite(option.redirect_url);
    res.redirect(url);
};
exports.wxoauthCallback = function(req,res){
    var code = req.query.code;
    console.log(code);
    client.getAccessToken(code, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;//手机号的openid
        if(err){
            res.send("回调失败"+result);
        }else{
			//res.send("回调成功"+result);
            client.getUser(openid, function (err, result) {
                var userInfo = result;
                //console.log(userInfo);
                if(err){
                    res.send("获取用户信息失败");
                }else{
                    res.json(userInfo);
                }
            });
        }
    });
}
