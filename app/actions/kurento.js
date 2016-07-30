var ppt = require("../models/PPTDb");
var tools = require("./tools");

/*
 * 创建房间页面
 */
exports.index = function (req,res){
	res.render('kurento/index');
};
/*
 * room页面
 */
exports.room = function (req,res){
	var roomId = req.params.id || '';
	var uid = "1231";
	//ppt.listByUid(uid,function(err,rows){
	//	var response ={};
	//	if(err){
	//		response.code="0";
	//		response.msg="调用失败";
	//		response.pptdata=[];
	//		response.uid= uid;
	//		response.title = "hoozha";
	//		res.render('room', {roomId:roomId,"uid":uid,"ppts":response.pptdata});
	//	}else{
	//		response.code="1";
	//		response.msg="调用成功";
	//		response.pptdata= rows;
	//		response.uid= uid;
	//		response.title = "hoozha";
	//		res.render('room', {roomId:roomId,"uid":uid,"ppts":response.pptdata});
	//	}
	//});
	res.render('room', {roomId:roomId,"uid":uid,"ppts":[]});
	//res.render('kurento/index');
};