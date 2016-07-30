
// var express = require('express');
// var router = express.Router();

module.exports = function(app){
	
	// var routes = require('../routes')
	// ,user = require('../routes/user')
	// ,video = require('../routes/video');

	var index = require('../routes/index')
	,user = require('../routes/user')
	,qqoauth = require('../routes/qqoauth')
	,wxoauth = require('../routes/wxoauth')
	,weibooauth = require('../routes/weibooauth')
	,passport=require('passport')
	,users = require('../routes/users'),
	ppt = require('../routes/ppt');
	
	app.get('/', index);
	//app.get('/:room', index);
	app.get('/ok', index);
	app.get('/routetest', index);
	app.get('/login/*', index);//login/result1?var=tom

	//微信oauth
	app.get('/logon/wechatoauth',wxoauth.wxoauth);
	app.get('/wxoauth/callback',wxoauth.wxoauthCallback);

	//qq登录
	app.get('/logon/qqoauth',qqoauth.qqoauth);
	app.get('/logon/qq',qqoauth.qqoauthCallback);

	////微博登录
	app.use(passport.initialize());
	app.use(passport.session());
	app.get('/logon/weibo',weibooauth);
	app.get('/logon/weibo/callback',weibooauth);


	app.get('/ppt', ppt.getPPT);
	// app.use('/users', users);
	// app.get('/ttlogin',user.ttlogin);
	// app.post('/ttlogin.json',user.login_check);
};