var utils = require('utility')
,cookieParser = require('cookie-parser');
var async = require('async');
// var user_model = require('../models/user');
var tools = require('./tools');
// var logger = require('../log').logger;
/*
 * 登录页面
 */
exports.login = function (req,res){
	var userinfo = tools.getUserInfo(req, res);
	var uid = userinfo.uid;
	var type = userinfo.type;
	if(uid){
		if(type == 1){
			res.redirect('/teacherinfo');
        }else{
            res.redirect('/teacherlist');
		}
	}
	res.render('login-glbl');
};
/*
 * 用户登录
 */
exports.userlogin = function(req,res){
	var username = req.body.username,
		usertype = req.body.type,
		userpwd = req.body.pwd;
		
	userpwd = decodeURIComponent(userpwd);
    if (userpwd.length > 8) {
    	userpwd = userpwd.substr(3, userpwd.length - 8);
    	userpwd = utils.base64decode(userpwd);
    }
    userpwd = utils.md5(userpwd);
	user_model.getUserInfo({name:username,type:usertype},function(err,rows){
		if(rows.length > 0){
			if(userpwd == rows[0]['password']){
				//要存入cookie的信息
				var userinfo = {'uid': rows[0]['uid'],'grades': rows[0]['grades'],'type': rows[0]['type'],'username':rows[0]['uname'],'nickname': rows[0]['nickname'],'course':rows[0]['course'],'sex':rows[0]['sex'],'mood':rows[0]['mood'],'school':rows[0]['school']};
				res.cookie('user_info', userinfo, {signed:true,maxAge:1000*60*60*24*7});//set cookie
				res.json({code:"1",msg:"success",data:{'type':rows[0]['type']}});
			}else{
				res.json({code:"2",msg:"pwd Failed",data:{}});
			}
		}else{
			res.json({code:"0",msg:"Failed",data:{}});
		}
	});
};
/**
 * 退出
 * @param req
 * @param res
 */
exports.loginout = function(req, res){
 	res.clearCookie('user_info');
 	res.redirect('/login');
};
/**
 * 学生注册页面
 * @param req
 * @param res
 */
exports.register = function(req, res){ 
	res.render("sign",{});
};
/*
 * 注册事件
 */
exports.sign = function(req, res){
	// console.log(123);
	var Ruid = Math.random().toString(36).substr(2);
	var type = 2,sex = "F";
	var telnumber = req.body.telnumber,
	username = req.body.username,
	pwd = req.body.pwd;
	var pwd = decodeURIComponent(pwd);
	
    if (pwd.length > 8) {
        pwd = pwd.substr(3, pwd.length - 8);
        pwd = utils.base64decode(pwd);
    }
    pwd = utils.md5(pwd);
	var user_opt = {'uid':Ruid,'type':type,'sex':sex,'telnumber':telnumber,'uname':username,'password':pwd};
	
	async.waterfall([function(callback) {
		user_model.issetphone({'telnumber':telnumber}, function(err, rows){
			if(rows.length > 0){//手机号存在
				res.json({code:"2",msg:"手机号已经存在"});
			}else{
				callback(null,1);
			}
		});
	},function(n, callback) {
		user_model.issetusername({'name':username}, function(err, rows){
			if(rows.length > 0){//用户名存在
				res.json({code:"3",msg:"用户名已经存在"});
			}else{
				callback(null,1);
			}
		});
	},function(n, callback) {
		user_model.userSign(user_opt, function(err, rows){
			if (rows){
				var userinfo = {'uid':user_opt.uid,'type': user_opt.type,'username':user_opt.uname,'sex':user_opt.sex};
				res.cookie('user_info', userinfo, {signed:true,maxAge:1000*60*60*24*7});
				res.json({code:"1",msg:"注册成功"});
			}else{
				res.json({code:"0",msg:"注册失败"});
			}
		});
	}]);
};
/** 
 * 老师详情页
 * @param req
 * @param res
 */
exports.teacherinfo = function(req, res){
	logger.error("this is log");
	var userinfo = tools.getUserInfo(req, res);
	var uid = userinfo.uid;
	var type = userinfo.type;
	if(!uid || type != 1){
		res.redirect('/login');
	}
	var userInfo = tools.getUserInfo(req, res), utype = userInfo.type;
	user_model.getTeacherInfo({uid:uid,'type':utype}, function(err, rows){
		if(err) res.render("teacherinfo",{msg:"调用失败"});
		if(!!rows && rows.length > 0){
			console.log(JSON.stringify(rows));
			res.render("teacherinfo", {'uid':rows[0]['uid'],'mood':rows[0]['mood'],'sex':rows[0]['sex'],'school':rows[0]['school'],'nickname':rows[0]['nickname'],'course':rows[0]['course']});
		}
		else{
			res.render('error',{code : '0',msg:"没有此用户信息"});
		}
	});
};
/**
 * 老师列表页
 * @param req
 * @param res
 */
exports.teacherlist = function(req, res){
	var userinfo = tools.getUserInfo(req, res);
	var uid = userinfo.uid;
	var type = userinfo.type;
	if(!uid || type != 2){
		res.redirect('/login');
	}

	user_model.getTeachers(function(err, rows){
		if(rows.length>0){
        	async.parallel([
        	    function(cp) {
        	    	var rooms = Array();
                	var users = Array();
                	var math = Array();
                	var english = Array();
                	var chinese = Array();
                	async.mapSeries(rows, function(row, callback){
                        if(row){
                            //callback(null, item);
                            ppt_lib.redis.get("room-"+row.uid, function(err, result){
                                var roomid = result;
                                if (roomid) {
                                    row.roomid = roomid;
                                    //获取房间状态
                                    ppt_lib.redis.scard("room_"+roomid, function(err, result){
                                        var room_mems = result;
                                        if(room_mems > 0){
                                            row.state = "busy";
                                        }else{
                                            row.state = "free";	
                                        }
										if(row.course == '作文'){
											chinese.push(row);
										}else if(row.course == '英语'){
											english.push(row);
										}else{
											math.push(row);
										}
                                    });
									rooms.push(roomid);
                                }
                                //users.push(row);
                                callback(null, {"rooms":rooms,"users":users,'chinese':chinese,'english':english,'math':math});
                                // console.log(users);
                            });
                        }
                    }, function(err, result){
                       cp(null,{"rooms": rooms,"users":users,'chinese':chinese,'english':english,'math':math});
                    });
        	    },
        	    function(cp) {
        	    	user_model.getUserById(uid,function(err,rows){
        	    		cp(null,rows);
        	    	});
        	    }
        	], function(err, results) {
        		var rooms = results[0].rooms,
        			users = results[0].users,
        			chinese = results[0].chinese,
        			english = results[0].english,
        			math = results[0].math,
        			userinfo = results[1][0];
        			res.render("teacherlist",{"rooms": JSON.stringify(rooms),"chinese":chinese,"english":english,"math":math,'userinfo':userinfo});
        	});
		}
	});
};


/**
 * 老师注册
 * @param req
 * @param res
 */
exports.teachersign = function(req, res){ 
	res.render("teachersign",{});
};

exports.tregister = function(req, res){
	console.log(123);
	var Ruid = Math.random().toString(36).substr(2);
	var type = 1,sex = "M";
	console.log(type);
	var telnumber = req.body.telnumber,
	username = req.body.username,
	pwd = req.body.pwd;
	var pwd = decodeURIComponent(pwd);
	
    if (pwd.length > 8) {
        pwd = pwd.substr(3, pwd.length - 8);
        pwd = utils.base64decode(pwd);
    }
    pwd = utils.md5(pwd);
	var user_opt = {'uid':Ruid,'type':type,'sex':sex,'telnumber':telnumber,'uname':username,'password':pwd};
	
	async.waterfall([function(callback) {
		user_model.issetphone({'telnumber':telnumber}, function(err, rows){
			if(rows.length > 0){//手机号存在
				res.json({code:"2",msg:"手机号已经存在"});
			}else{
				callback(null,1);
			}
		});
	},function(n, callback) {
		user_model.issetusername({'name':username}, function(err, rows){
			if(rows.length > 0){//用户名存在
				res.json({code:"3",msg:"用户名已经存在"});
			}else{
				callback(null,1);
			}
		});
	},function(n, callback) {
		user_model.teacherSign(user_opt, function(err, rows){
			if (rows){
				var userinfo = {'uid':user_opt.uid,'type': user_opt.type,'username':user_opt.uname,'sex':user_opt.sex};
				res.cookie('user_info', userinfo, {signed:true,maxAge:1000*60*60*24*7});
				res.json({code:"1",msg:"注册成功"});
			}else{
				res.json({code:"0",msg:"注册失败"});
			}
		});
	}]);
};
/**
 * 编辑资料
 * @param req
 * @param res
 */
exports.editdata = function(req, res){
	var id = req.body.id;
	sextype = req.body.sextype,
	mood = req.body.user_mood,
	school = req.body.school,
	nickname = req.body.nickname,
	course = req.body.user_course;
	var user_opt = {uid:id,'mood':mood,'school':school,'sex':sextype,'nickname':nickname,'course':course};
	console.log(user_opt,'----22-----');
	user_model.editTeacher(user_opt, function(err, result){
		console.log(result,'------1111111');
		if (result.changedRows>=0){
			var info = tools.getUserInfo(req, res);
			var user_info = {'uid':user_opt.uid,'mood':user_opt.mood,'school':user_opt.school,'type':info.type,'nickname':user_opt.nickname,'course':user_opt.course,'username':user_opt.uname,'sex':user_opt.sex};
			res.cookie('user_info', user_info, {signed:true,maxAge:1000*60*60*24*7});
			res.json({code:"1",msg:"success",data:{}});
		}
		else{
			res.json({code:"0",msg:"修改失败",data:{}});
		}
	});
};
/**
 * 学生端编辑资料
 * @param req
 * @param res
 */
exports.stuedit = function(req, res){
	var id = req.body.id;
	sextype = req.body.sextype,
	nickname = req.body.nickname,
	grades = req.body.grades;
	console.log(grades,'---------------123');
	var user_opt = {uid:id,'sex':sextype,'nickname':nickname,'grades':grades};
	user_model.editStudent(user_opt, function(err, result){
		console.log('changed ' + result.changedRows + ' rows');
		if (result.changedRows>=0){
			var info = tools.getUserInfo(req, res);
			var user_info = {'uid':user_opt.uid,'grades':user_opt.grades,'type':info.type,'nickname':user_opt.nickname,'username':user_opt.uname,'sex':user_opt.sex};
			console.log(user_info,'--------------------11');
			res.cookie('user_info', user_info, {signed:true,maxAge:1000*60*60*24*7});
			res.json({code:"1",msg:"success",data:{}});
		}
		else{
			res.json({code:"0",msg:"修改失败",data:{}});
		}
	});
};

/**
 * 教室主面板
 * @param req
 * @param res
 */
exports.main = function(req, res){
	var uid = tools.getUserId(req, res);
	if(!uid){
		res.redirect('/login');
	}
	var mode = req.query.mode;
	var roomid = req.query.roomid;
	var userinfo = tools.getUserInfo(req, res);//登录者信息
	var domain = tools.getDomain();//获取服务地址
	db.listByUid(uid,function(err,rows){
		var response ={};
		if(err){
			response.code="0";
			response.msg="调用失败";
			response.pptdata=[];
			response.uid= uid;
			response.title = ppt_lib.title;
			res.render('mainpanel', {"domain":domain,"mode":mode,"roomid":roomid,"uid":uid,"ppts":response.pptdata,'userinfo':userinfo});
		}else{
			response.code="1";
			response.msg="调用成功";
			response.pptdata= rows;
			response.uid= uid;
			response.title = ppt_lib.title;
			//console.log("ppt  == "+JSON.stringify(response));
			//ppt_lib.redis.smembers("borad_123",function(err,result){
			//	if(!!err) console.log("获取白板数据失败");
			//	res.render('mainpanel', {"borad_data":JSON.stringify(result),"mode":mode,"roomid":roomid,"uid":uid,"data":data,"ppts":response.pptdata});
			//});
			res.render('mainpanel', {"domain":domain,"mode":mode,"roomid":roomid,"uid":uid,"ppts":response.pptdata,'userinfo':userinfo});
		}
	});
};

/**
 * 获取PPT
 * @param req
 * @param res
 */
exports.loadppt = function(req, res){
	var uid = tools.getUserId(req, res);
	if(!uid){
		res.redirect('/login');
	}
	var rid = req.body.rid;
	tools.getPreview(rid, function(data){
		res.json({code : 1, data:data});
	});
};

/**
 * 发送 Im 邀请消息
 */
exports.sendMessage= function(req,res){

	var http = require('http');
	var body = "";
	if (req.body.gid) {
			var http = require('http');
			var url = ppt_lib.short_url+"c?url=" + req.query.url;
			var querystring = require('querystring');
			var post_data= querystring.stringify({url:req.body.url});
			var options = {
					host : 'tta.so',
					path : '/c',
					method : 'post',
					headers:{
						'Content-Type': 'application/x-www-form-urlencoded',
				         'Content-Length': post_data.length,
					}
				};
			
			
			var  post_req = http.request(options, function(response) {
					  console.log("Got response: " + response.statusCode);
					  response.on('data', function (chunk) {
						  console.log('buff length:' + chunk.length);
						  body += chunk;
					  });
					  response.on('end', function(){
						  
						  var urlobj = JSON.parse(body);
						  if(urlobj.code ="1"){
							  
							  
							  var querystring = require('querystring');
									var post_data = querystring.stringify({
									      'gid' : req.body.gid,
									      'sid': new Date().getTime(),
									      'tuid': req.body.tuid,
									       'fuid' : req.body.fuid,
									       'mtype' : 'text',
									       'content' : '我正在演讲ppt,'+ppt_lib.short_url+urlobj.data,
									       'fnickname' : req.body.nickname,
									        'rid' : ''
									  });
								var options = {
									host : ppt_lib.user_host,
									path : '/http-bind/send',
									method : 'post',
									headers:{
										'Content-Type': 'application/x-www-form-urlencoded',
								         'Content-Length': post_data.length,
									}
								};
			                             body="";
			                             
										var  post_req = http.request(options, function(response) {
											response.on('data', function(chunk) {
												body += chunk;
											});
											response.on('end', function() {
												console.log("body == " + body);
												var obj = JSON.parse(body);
												obj.tuid =  req.body.tuid;
//												obj.rid = req.query.rid;
//												obj.room = req.query.room;
//												obj.uid = req.query.uid;
//												user.ppt_id = req.body.rid;
//												user.roomid = req.body.room;
//												user.fuid = req.body.uid;
												if(obj.code =="1"){//发送消息成功
													insertIntoDB({ppt_id:req.body.rid,roomid:req.body.room,fuid:req.body.fuid,tuid:req.body.tuid},function(err,result){
														res.json(obj);
													});
												}else{
													res.json({code:"0",msg:"发送消息失败",data:{}});
												}
												
											});
										}).on('error', function(e) {
											
											res.json({code:"0",msg:"发送消息失败",data:{}});
										});
										
										
										 post_req.write(post_data);
										  post_req.end();
							  
						  }else{
							  res.json({
									code : "0",
									msg : "发送消息失败",
									data : {}
								});
							  
						  }
					  });
					}).on('error', function(e) {
						res.json({
							code : "0",
							msg : "发送消息失败",
							data : {}
						});
					});
			
				post_req.write(post_data);
				post_req.end();

	} else {
		res.json({
			code : "0",
			msg : "发送消息失败",
			data : {}
		});
	}

};
/**
 * 发送邮件
 */
exports.sendmail = function(req, res) {

	var user = {};

	if (req.body.to) {

		user.ppt_id = req.body.rid;
		user.roomid = req.body.room;
		user.fuid = req.body.uid;

		var nodemailer = require("nodemailer");
		var smtpTransport = nodemailer.createTransport("SMTP", {
			service : "Gmail",
			auth : {
				user : "leo.bejing@gmail.com",
				pass : "lncyfug@126.com"
			}
		});

		var address = req.body.to;
		var array = address.split(",");
		console.log("array == " + array);
		var index = 0;

		for ( var i = 0; i < array.length; i++) {
			index = i;
			user.tuid = array[i];
			insertIntoDB(JSON.parse(JSON.stringify(user)),function(err,result){
				if(index == array.length-1){
					
				var response = {};
				response.code = "1";
				response.msg = "添加成功";
				response.data = {};
				console.log("Message sent: " + response.message);
				res.json(response);
				}
			});
			var mailOptions = {
				from : "ppt秀 <xiaokai.shi@gmail.com>", // sender address
				to : array[i], // list of receivers
				subject : "PPT会议", // Subject line
				html : '<p>我正在演讲ppt,<a href="' + req.body.url
						+ '">点击链接加入</a></p>'
			};

			smtpTransport.sendMail(mailOptions, function(error, response) {
				if (error) {
					console.log("发送失败&&&&&&&&&&&&&&&&& ");
				} else {
					console.log("发送成功&&&&&&&&&&&&&&& ");
				}

			});
		}

		
	} else {
		var response = {};
		console.log("发送失败：" + error);
		response.code = "0";
		response.msg = "添加失败";
		response.data = {};
		res.json(response);

	}
};

exports.ttlogin = function(req, res) {
	res.render('ttlogin', {});
};
exports.login_check = function(req ,res){
	var response ={};
	response.code = "0";
	response.msg = "登陆成功";
	response.data = {};
	res.json(response);
};

/**
 * 根据用户sid，获取用户信息
 */
exports.getUserBySid = function(req, res) {
	var http = require('http');
	var body = "";

	if (req.query.sid) {
		var url = ppt_lib.user_url;
		console.log("url == " + url);
		var options = {
			host : ppt_lib.host,
			path : '/user/getUserBySid',
			method : 'get',
			headers : {
				'Tt-sid' : req.query.sid
			}
		};

		http.get(options, function(response) {
			console.log('options ' + JSON.stringify(options));
			response.on('data', function(chunk) {
				body += chunk;
			});
			response.on('end', function() {
				console.log("body == " + body);
				var obj = JSON.parse(body);
				obj.rid = req.query.rid;
				obj.room = req.query.room;
				obj.uid = req.query.uid;

				console.log("登录信息" + JSON.stringify(obj));
				res.json(obj);
			});
		}).on('error', function(e) {

			var response = {};
			response.code = "0";
			response.msg = "登录失败";
			response.data = {};

			console.log(":e == " + e);
			res.json(response);
		});
	} else {
		var response = {};
		response.code = "0";
		response.msg = "登录失败";
		response.data = {};
		console.log(":e == " + e);
		res.json(response);
	}

};

/**
 * 获取圈子成员列表
 */
exports.getMemberContactGroup = function(req, res) {
	var http = require('http');
	var body = "";
	
	db.getCachesendmail(req.body.uid,function(err,result){
		var maillist = result;
		if (req.body.sid) {
			var options = {
				host : ppt_lib.user_host,
				path : 'http://www.titii.com/api/groupcontact/getMemberContactGroup?gid='
						+ req.body.gid + '&curPriv=0&order=name_asc',
				method : 'get',
				headers : {
					'tt-sid' : req.body.sid,
					'tt-channel' : '100000100'
				}
			};

			http.get(options, function(response) {
				response.on('data', function(chunk) {
					body += chunk;
				});
				response.on('end', function() {
					var obj = JSON.parse(body);
					
					var memberlist = dealwitchContacts(maillist,obj.data.memberList);
					
					
					
					
					if(obj.code="1" ||(null != memberlist && memberlist.length>0)){//查询成功
	                    res.json({code:"1",msg:"获取联系人成功",data:memberlist});					
					}else{
						res.json({code:"0",msg:"获取联系人失败",data:[]});
					}
					
					

				});
			}).on('error', function(e) {
				var memberlist = dealwitchContacts(maillist,null);
				
				if(null != memberlist && memberlist.length>0){
                    res.json({code:"1",msg:"获取联系人成功",data:memberlist});					
				}else{
					res.json({code:"0",msg:"获取联系人失败",data:[]});
				}
			});
		} else {
			var memberlist = dealwitchContacts(maillist,null);
			
			if(null != memberlist && memberlist.length>0){
                res.json({code:"1",msg:"获取联系人成功",data:memberlist});					
			}else{
				res.json({code:"0",msg:"获取联系人失败",data:[]});
			}
		}
		
		
	});
	

	

};



exports.deleteinviteuser= function(req,res){
	console.log("deleteinviteuser body = "+JSON.stringify(req.body));
	if(req.body){
		db.deleteUser(req.body,function(err,result){
			if(result){
				res.json({code:"1",msg:"删除成功",data:req.body});
			}else{
				res.json({code:"0",msg:"删除失败",data:{}});
			}
		});
	}else{
		res.json({code:"0",msg:"删除失败",data:{}});
	}
};


function encrypt(str, secret) {
	var crypto = require('crypto');
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
}
function decrypt(str, secret) {
	var crypto = require('crypto');
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function a(key, text) {
	try {

		// console.log('tostring == '+key.toString());
		var crypto = require('crypto');
		var cipher = crypto.createCipher('aes192', '123');
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		var message = crypted;
		console.log("加密后的值：" + message);
		var decipher = crypto.createDecipher('aes192', '123');
		var dec = decipher.update(crypted, 'hex', 'utf8');
		dec += decipher.final('utf8');
		console.log('解密之后的值:' + dec);

		// console.log('key== '+key);
		// console.log('text == '+text);
		// var crypto = require('crypto');
		// var cipher= crypto.createCipher('aes-256-cbc',new Buffer(key));
		// // var key="asdhjwheru*asd123-123";//加密的秘钥
		// // var text =
		// "123|12312312123123121231231212312312123123121231231212312312";
		// var crypted =cipher.update(text,'utf8','hex');
		// crypted+=cipher.final('hex');
		// var message=crypted;//加密之后的值
		// console.log("加密后的值："+message);
		//	
		// var decipher = crypto.createDecipher('aes-256-cbc',key);
		// var dec=decipher.update(message,'hex','utf8');
		// dec+= decipher.final('utf8');//解密之后的值
		// console.log('解密之后的值:'+dec);
	} catch (e) {
		console.log("error == " + e);
	}
}


function insertIntoDB(user,callback) {
	db.checkinvite(user, function(err, result) {
		if (err || result.length == 0) {
			db.insertPPTinvite(user, function(err, result) {
				if (err) {

					console.log("插入数据库失败：&&&&&&&&&&&&&77  " + err);

				} else {
					console.log("插入数据库成功：&&&&&&&&&&&&&  "
							+ JSON.stringify(result));
				}
				callback(this,err,result);
				
			});
		} else {
			callback(this,err,result);
		}
	});
}
function dealwitchContacts(maillist,memberlist){
	var list =[];
	
	
	if(null != memberlist && memberlist.length>0 ){
		for(var k = 0;k<memberlist.length;k++){
			var contact = memberlist[k];
//	console.log("contact ********************8  "+JSON.stringify(contact));
			var member = {contactType:1,contactUserId:contact.contactUserId,nickName:contact.nickName,icon:contact.icon,uNickName:contact.uNickName,phoneNum:contact.phoneNum,initialsName:contact.initialsName,
					spellingName:contact.spellingName};
			list[k] = member;
		}

	}
	if(null != maillist && maillist.length>0){
		var templist=[];
		for ( var i = 0; i < maillist.length; i++) {
			var mail = maillist[i];
			var member = {contactType:1,contactUserId:mail,nickName:mail,icon:"",uNickName:"",phoneNum:"",initialsName:"",spellingName:""};
			templist[i] = member;
		}
		list = list.concat(templist);
	}
	return list;
}

