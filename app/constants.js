'use strict';
var default_constants = {
	WS_ACTION: 'ws',
	
	WS_CREATE_ACTION: 'create',
	
	WS_EVENT_OPEN: 'open',
	WS_EVENT_MESSAGE: 'message',
	WS_EVENT_ERROR: 'error',
	WS_EVENT_CLOSE: 'close',
	
	AS_URI: 'https://localhost:8443',
	WS_URI: 'ws://101.200.85.212:8888/kurento'
};
var mysql = require('mysql');
var redis_mod = require('redis');
var db = {},redis_opt={},my_conf = {};
var domain = "https://192.168.51.96:9999/";
var extend = require('node.extend');
/**
 * 设置redis
 * @type {{host: string, port: number}}
 */
var _env = process.env.NODE_ENV || 'development';
switch (_env)
{
	case "production":
		db = {
			    host : '10.171.34.230',//192.168.51.105
				port : 3306,
				user : 'tt_prod_hoozha',
				password : 'tt_prod_hoozha',
				database : 'tt_prod_hoozha',
				charset : 'UTF8_GENERAL_CI',
				debug : false
		};
		redis_opt = {
			host : "10.171.34.230",//10.171.34.230:5379
			port : 5380,
			switch : 1
		};
		my_conf = {
			preview_url : "http://doc.tt139.com/preview/",
			short_url : "http://tta.so/",
			user_url : "http://v5ttcgi.titii.com/",
			host  : "v5ttcgi.titii.com",
			user_host : "www.titii.com",
			im_host : "http://117.79.154.211:9280",
			icon_url : "tt139.com/rc/geticon?",
			test  :  false,
			audioserver_nuveurl : "http://119.254.231.28:3000/",
			audioserver_nuvekey : "5284651953e9bc64e2876ceb",
			audioserver_nuvepwd : "10007",
			title : "hoozha",
			cookieSecret : ""
		};
		domain = "https://www.hoozha.com/";
	break;
	case "testing":
		db = {
			    host : '10.171.34.230',//192.168.51.105
				port : 3306,
				user : 'tt_test_hoozha',
				password : 'tt_test_hoozha',
				database : 'tt_test_hoozha',
				charset : 'UTF8_GENERAL_CI',
				debug : false
		};
		redis_opt = {
			host : "10.171.34.230",//10.171.34.230:5379
			port : 5379,
			switch : 1
		};
		my_conf = {
			preview_url : "http://doc.tt139.com/preview/",
			short_url : "http://tta.so/",
			user_url : "http://v5ttcgi.titii.com/",
			host  : "v5ttcgi.titii.com",
			user_host : "www.titii.com",
			im_host : "http://117.79.154.211:9280",
			icon_url : "tt139.com/rc/geticon?",
			test  :  false,
			audioserver_nuveurl : "http://119.254.231.28:3000/",
			audioserver_nuvekey : "5284651953e9bc64e2876ceb",
			audioserver_nuvepwd : "10007",
			title : "hoozha",
			cookieSecret : ""	
		};
		domain = "https://test.hoozha.com:8888/";
	break;	
	case "development":
		db = {
			    host : '192.168.51.96',//192.168.51.105
				port : 3306,
				user : 'tt2',
				password : '123456',
				database : 'tt_glbl',
				charset : 'UTF8_GENERAL_CI',
				debug : false
		};

		redis_opt = {
			host : "192.168.51.96",
			port : 6379,
			switch : 1
		};
		my_conf = {
			preview_url : "http://doc.tt139.com/preview/",
			short_url : "http://tta.so/",
			user_url : "http://v5ttcgi.titii.com/",
			host  : "v5ttcgi.titii.com",
			user_host : "www.titii.com",
			im_host : "http://117.79.154.211:9280",
			icon_url : "tt139.com/rc/geticon?",
			test  :  false,
			audioserver_nuveurl : "http://119.254.231.28:3000/",
			audioserver_nuvekey : "5284651953e9bc64e2876ceb",
			audioserver_nuvepwd : "10007",
			title : "hoozha",
			cookieSecret : ""	
		};
		domain = "https://192.168.51.96:9999/";
	break;	
}

var final_opt = {
	env : _env,
	domain : domain,
	redis_opt : redis_opt,
};
final_opt = extend(final_opt, my_conf);
var Constants = extend(default_constants, final_opt);

Constants.redis= redis_mod.createClient({ "host": redis_opt.host, "port": redis_opt.port });
Constants.redis.on('error', function (err) {
	console.log('errorevent - ' + Constants.redis.host + ':' + Constants.redis.port + ' - ' + err);
});

Constants.pool = mysql.createPool({
    host : db.host,
    port : db.port,
    user : db.user,
    password : db.password,
    database : db.database,
    charset : db.charset,
    debug : db.debug
});
console.log('load db connection.');
console.log('db config: ' + JSON.stringify(db));
console.log("preview url :"+Constants.preview_url);
console.log('constants:'+JSON.stringify(Constants.redis_opt));
console.log('constants:'+(Constants));

module.exports = Constants;