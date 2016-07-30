var db = require('../constants');
var pool = db.pool;

/**
 * 根据 ppt_id 获取一条ppt信息
 */
exports.getpptInfo = function(ppt_id, callback) {
	pool.getConnection(function(err, connection) {
		connection.query('SELECT  * from ppt_collections where ppt_id =?',
				[ ppt_id ], function(err, rows, fields) {
					callback.call(this, err, rows);
					connection.destroy();
				});
	});
};

/**
 * 获取用户 ppt列表
 */
exports.listByUid = function(tt_uid, callback) {
	pool.getConnection(function(err, connection) {
		connection.query('SELECT * from  ppt_collections  where tt_uid =? '+' order by upload_time desc',[tt_uid], function(err, rows, fields) {
			dealUploadTime(rows);
			callback.call(this, err, rows);
			connection.destroy();
		});
	});
};

/**
 * ppt_collections 插入新记录
 */
exports.insertPPTcollections = function(data, callback) {
	pool.getConnection(function(err, connection) {
		console.log("data " + JSON.stringify(data));
		connection.query('INSERT INTO ppt_collections SET?', {
			ppt_id : data.ppt_id,
			tt_uid : data.tt_uid,
			ppt_name : data.ppt_name,
			ppt_size : data.ppt_size,
			cover_image : data.cover_image,
			slide_num : data.slide_num,
			upload_time : data.upload_time
		}, function(err, result) {
			result = result || {};
			console.log("insert1 " + JSON.stringify(result));
			callback.call(this, err, result);
			connection.destroy();
		});
	});
};

/**
 * ppt_upload_record 插入上传记录
 */
exports.insertPPTuploadrecord = function(data, callback) {
	pool.getConnection(function(err, connection) {
		console.log("inset upload " + JSON.stringify(data));
		connection.query('INSERT INTO ppt_upload_record SET?', {
			ppt_id : data.ppt_id,
			tt_uid : data.tt_uid,
			ppt_name : data.ppt_name,
			ppt_size : data.ppt_size,
			cover_image : data.cover_image,
			slide_num : data.slide_num,
			upload_time : data.upload_time
		}, function(err, result) {
			result = result || {};
			console.log("insert2 " + JSON.stringify(result));
			callback.call(this, err, result);
			connection.destroy();
		});
	});

};

/**
 * 插入邀请记录
 */
exports.insertPPTinvite = function(data, callback) {
	pool.getConnection(function(err, connection) {
		var time = new Date();
		connection.query('INSERT INTO ppt_invite SET?', {
			fuid : data.fuid,
			tuid : data.tuid,
			roomid : data.roomid,
			ppt_id : data.ppt_id,
			itime : time
		}, function(err, result) {
			result = result || {};
			callback.call(this, err, result);
			connection.destroy();
		});
	});
};

/**
 * 获取邀请用户 audio room id
 */
exports.getaudioroomid= function(data,callback){
	pool.getConnection(function(err,connection){
		connection.query("SELECT audioroomid FROM audioroom where ppt_id =? AND roomid=?",[data.ppt_id,data.roomid],function(err,rows,fields){
//			result = result || [];
			var audioroomid = null;
			if(rows != null && rows.length>0){
				audioroomid=rows[0].audioroomid;
			}
			callback.call(this,err,audioroomid);
			connection.destroy();
		});
	});
};

/**
 * 检查是否邀请过
 */
exports.checkinvite= function(data,callback){
	pool.getConnection(function(err,connection){
		connection.query("SELECT * FROM ppt_invite where fuid =? AND tuid=? AND roomid=?",[data.fuid,data.tuid,data.roomid],function(err,result,fields){
			result = result || [];
			console.log("inview result "+JSON.stringify(result));
			callback.call(this,err,result);
			connection.destroy();
		});
	});
};

/**
 * 检查用户是否已经加入房间
 */
exports.checkhasJoined= function(data,callback){
	pool.getConnection(function(err,connection){
		connection.query("SELECT * FROM ppt_invite where fuid =? AND tuid=? AND roomid=?",[data.fuid,data.tuid,data.roomid],function(err,result,fields){
			result = result ||[];
			console.log("检查用户是否已经加入房间 "+JSON.stringify(result));
			callback.call(this,err,result);
			connection.destroy();
		});
	});
	
};

/**
 *获取加入房间的用户
 */
exports.getUserJoined= function(data,callback){
	pool.getConnection(function(err,connection){
		connection.query("SELECT * FROM ppt_invite where fuid =? AND roomid=? ",[data.fuid,data.roomid],function(err,result,fields){
			result = result ||[];
			callback.call(this,err,result);
			connection.destroy();
		});
	});
};


/**
 *更新加入room时间时间
 */
exports.updateInviteInfo= function(id,time,callback){
	pool.getConnection(function(err,connection){
		connection.query("UPDATE ppt_invite SET jtime="+ connection.escape(time)+" where id=?",[id] ,function(err,result){
			callback.call(this,err,result);
		
			connection.destroy();
			
		});
	});
};

/**
 *更新加入room时间时间
 */
exports.updatelevetime= function(id,time){
	pool.getConnection(function(err,connection){
		connection.query("UPDATE ppt_invite SET dtime="+ connection.escape(time)+" where id=?",[id] ,function(err,result){
			connnection.destroy();
		
		});
	});
};

/**
 *插入audio room 号
 */
exports.insertaudioroomid= function(data,callback){
	

	pool.getConnection(function(err, connection) {
		console.log("data " + JSON.stringify(data));
		connection.query('INSERT INTO audioroom SET?', {
			ppt_id : data.ppt_id,
			roomid : data.roomid,
			audioroomid : data.audioroomid
		}, function(err, result) {
			result = result || {};
			console.log("insert1 " + JSON.stringify(result));
			callback.call(this, err, result);
			connection.destroy();
		});

	});

	};

/**
 * 删除房间用户
 */
exports.deleteUser = function(data,callback){
	pool.getConnection(function(err, connection) {
		connection.query('DELETE FROM ppt_invite WHERE ppt_id =? AND fuid=? AND tuid=?',
				[ data.ppt_id,data.fuid,data.tuid ], function(err, result) {
			if(result.affectedRows>0){
				callback.call(this, err, true);
				
			}else{
				callback.call(this,err,false);
			}
					connection.destroy();
				});
	});
};

/**
 * 删除房间号邀请
 */
exports.deleteInviteByRoom = function(data, callback) {

};

/**
 * 根据 ppt_id 删除记录
 */
exports.deleteByPPTid = function(ppt_id, callback) {
	pool.getConnection(function(err, connection) {
		connection.query('DELETE FROM ppt_collections WHERE ppt_id =?',
				[ ppt_id ], function(err, result) {
					callback.call(this, err, result);
					connection.destroy();
				});
	});
};


/**
 * 根据 id 删除记录
 */
exports.deleteById = function(id, callback) {
	pool.getConnection(function(err, connection) {
		connection.query('DELETE FROM ppt_collections WHERE id =?',
				[id], function(err, result) {
					callback.call(this, err, result);
					connection.destroy();
				});
	});
};

exports.getCachesendmail= function(uid,callback){
	pool.getConnection(function(err,connnection){
		
		var query = 'SELECT tuid from  ppt_invite  where fuid = ' + uid;
		connnection.query(query,function(err,rows, fields){
			
			var maillist = getMaillist(rows);
			
			callback.call(this,err,maillist);
			connnection.destroy();
		});
	});
};

/**
 * 获取邮件列表
 * @param rows
 * @returns {Array}
 */
function getMaillist(rows){
	var maillist =[];
	var index = 0;
	if(rows && rows.length >0){
		for(var i = 0; i< rows.length;i++){
			if(isEmail(rows[i].tuid)){
				maillist[index] = rows[i].tuid;
				index++;
			}
		}
	}
	return maillist;
}
function isEmail(address){
    var reg = /^([a-zA-Z0-9_-|.])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var array  = address.split(",");
    var flag = false;
    
    for(var i = 0;i<array.length;i++){
 	    flag= reg.test(array[i]);
 	   if(!flag){
 		   return false;
 	   }
 	   
    }
    return true;
};


/**
 * 处理时间
 */
function dealUploadTime(rows) {
	if (rows && rows.length > 0) {
		for ( var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var upload_time = row.upload_time;
			row.upload_time = new Date(upload_time).getTime();
		}
	}

};

