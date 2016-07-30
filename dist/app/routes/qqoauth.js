var oauth = require('../config/oauth');
var option = oauth.qq;
//var OAuth2 = require('../lib/oauth2');
//var oauth2 = new OAuth2(option);
exports.qqoauth = function(req,res){
	var url = option.base_uri+"client_id="+option.client_id+"&redirect_uri="+option.redirect_uri+"&response_type="+option.response_type+"&state="+option.state;
	console.log("url == "+url);
	res.redirect(url);
}
exports.qqoauthCallback = function(req,res){
	var code = req.query.code;
	getAccessToken(req.query.code,function(err,access_token){
		if(err){
			res.send("回调失败"+access_token);
		}else{
//			res.send("回调成功"+access_token);
			getOpenId(access_token,function(err,openid){
				var openid = openid;
				if(err){
					res.send("获取openid失败");
				}else{
					//res.send("获取openid成功");
					getUserInfo(access_token,openid,function(err,userInfo){
						var userInfo = userInfo;
						if(err){
							res.send("获取用户信息失败");
						}else{
							//res.send("获取用户信息成功");
							res.json(userInfo);
						}
					});
				}
			});
		}
	});
}
/**
 * 获取用户openId
 * @param token
 * @param callback
 */
function getOpenId(token,callback){
	var https=require('https');
	var options={
		host:'graph.qq.com',
		path:'/oauth2.0/me?access_token='+token,
		method:'get'
	};
	var body="";
	https.get(options,function(response){
		response.on('data',function(chunk){
			body+=chunk;
		});
		response.on('end',function(){
			body = body.substring(body.indexOf("{", 0), body.indexOf("}",0)+1);
			var obj = JSON.parse(body);
			callback.call(this,null,obj.openid);
		});
	}).on('error', function(e) {
		callback.call(this,e,'');
	});

}


/**
 * 获取 token
 * @param code
 * @param callback
 */
function getAccessToken(code ,callback){
	var http= require('https');
	var options = {
		host : "graph.qq.com",
		path : '/oauth2.0/token?grant_type=authorization_code&client_id='+option.client_id+'&client_secret='+option.app_key+'&code='+code+'&redirect_uri='+option.redirect_uri+'&state='+option.state,
		method : 'get'

	};
	var body="";
	http.get(options, function(response) {
		console.log('options ' + JSON.stringify(options));
		response.on('data', function(chunk) {
			body += chunk;
		});
		response.on('end', function() {
			console.log("body == " + body);
			var querystring = require('querystring');
			var token = querystring.parse(body).access_token;
			console.log("token == "+token);
			callback.call(this,null,token);
		});
	}).on('error', function(e) {
		callback.call(this,e,'');
//			res.send("qq登录失败");
	});

};


/**
 * 获取用户数据
 * @param token
 * @param openid
 * @param callback
 */
function getUserInfo(token,openid,callback){

//	/user/get_user_info?access_token=YOUR_ACCESS_TOKEN&oauth_consumer_key=YOUR_APP_ID&openid=YOUR_OPENID
	var http= require('https');
	var options = {
		host : "graph.qq.com",
		path : '/user/get_user_info?access_token='+token+'&oauth_consumer_key='+option.client_id+'&openid='+openid,
		method : 'get'

	};
	var body="";
	http.get(options, function(response) {
		response.on('data', function(chunk) {
			body += chunk;
		});
		response.on('end', function() {
			console.log("body == " + body);
			var obj = JSON.parse(body);
			console.log("用户信息信息" + JSON.stringify(obj));
			callback.call(this,null,obj);
		});
	}).on('error', function(e) {
		callback.call(this,e,{});
	});
}