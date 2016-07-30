 var ppt_lib = require('../constants');
// var user_model = require('../models/user');
/*
 * 获取当前登录者--uid
 */
exports.getUserId = function (req, res){
	var _userInfo = req.signedCookies.user_info;
	if(!_userInfo){
		return false;
	}else{
		return _userInfo.uid
	}
};
/*
 * 获取当前登录者--用户信息
 */
exports.getUserInfo = function (req, res){
	var _userInfo = req.signedCookies.user_info;
	if(!_userInfo){
		return false;
	}else{
		return _userInfo
	}
};

/**
 * 获取当前环境变量
 * @param req
 * @param res
 */
exports.getDomain = function (){
	var env = {};
	env.domain = ppt_lib.domain;
	return env.domain;
};

/**
 * 获取预览服务器资源
 * @param rid
 * @param callback
 */
exports.getPreview = function(rid, callback){
	var url = ppt_lib.preview_url + rid + '.json';
	var http = require('http');
	var body = "";
	http.get(url, function (response) {
		console.log("Got response: " + response.statusCode);
		response.on('data', function (chunk) {
			console.log('buff length:' + chunk.length);
			body += chunk;
		});
		response.on('end', function () {
			var obj = JSON.parse(body);
			obj.rid = rid;
			var data = obj.data;
			if (data == null) {
				data = [];
			}
			obj.data = JSON.stringify(data);
			callback(obj);
			//res.render("main",{"mode":mode,"roomid":roomid,"uid":uid,"data":obj.data});
			//res.send(body);
		});
	}).on('error', function (e) {
		console.log("Got error: " + e.message);
		callback(false);
	});
};