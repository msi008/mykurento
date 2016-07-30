var express = require('express');
var router = express.Router();
var index = require('../routes/index');
var kurento = require('../actions/kurento');
var ppt = require('../actions/ppt');
var qqoauth = require('../routes/qqoauth');
var weibooauth = require('../routes/weibooauth');
// var phone = require('../routes/phone');
// var sendemail = require('../routes/sendemail');
var passport=require('passport');

var login = require('../routes/login');
var invite = require('../routes/invite');


var wxoauth = require('../routes/wxoauth');
var weibooauth = require('../routes/weibooauth');

router.get('/', kurento.room);
router.get('/:id([0-9]{6})', kurento.room);

router.post('/loadppt', ppt.loadppt);


 //邀请人
 router.get('/invite',invite.invite);
 router.post('/sendmessage',invite.sendmessage);

//登录
router.get('/login',login.login);

//qq oauth
router.get('/logon/qqoauth',qqoauth.qqoauth);
router.get('/logon/qq',qqoauth.qqoauthCallback);

//手机注册登录
// router.get('/user/create_phone',phone);
// router.get('/user/sendemail',sendemail.sendemail);

//微博oauth
//router.use(passport.initialize());
//// router.use(passport.session());
//router.get('/logon/weibo',weibooauth);
//router.get('/logon/weibo/callback',weibooauth);

module.exports = router;

// module.exports = function(app){
	// var index = require('../routes/index')
//	,user = require('../routes/user')
//	,qqoauth = require('../routes/qqoauth')
//	,wxoauth = require('../routes/wxoauth')
//	,weibooauth = require('../routes/weibooauth')

//
//	,ppt = require('../routes/ppt')
//	,users = require('../routes/users')
//	,kurento = require('../routes/kurento');
//
//	passport=require('passport')    //用passport需要在这里引一下
//	app.get('/', kurento.room);
//	app.get('/:room', kurento.room);
//	app.get('/ok', index);
//	app.get('/routetest', index);
//	app.get('/login/*', index);//login/result1?var=tom
//
//	//app.get('/kurento', kurento.index);
//	//app.get('/kurento_room', kurento.room);
//
//
//	//微信oauth
//	app.get('/logon/wechatoauth',wxoauth.wxoauth);
//	app.get('/wxoauth/callback',wxoauth.wxoauthCallback);
//
//	//qq登录
//	app.get('/logon/qqoauth',qqoauth.qqoauth);
//	app.get('/logon/qq',qqoauth.qqoauthCallback);
//
//
//	//微博oauth
//	app.use(passport.initialize());
//	// app.use(passport.session());
//	app.get('/logon/weibo',weibooauth);
//	app.get('/logon/weibo/callback',weibooauth);
//
//
//	app.get('/ppt1', ppt.getPPT);
//	app.post('/loadppt', ppt.loadppt);
//

// app.use('/users', users);
// app.get('/ttlogin',user.ttlogin);
// app.post('/ttlogin.json',user.login_check);

// };