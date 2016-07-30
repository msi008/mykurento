/**
 * ppt controller
 */
var logger = require("../../log").logger;
var ppt = require("../models/PPTDb");
module.exports.getPPT = function(req,res){
    logger.info("enter in ppt");
    var uid = "1231";
    ppt.listByUid(uid,function(err,rows){
        var response ={};
        if(err){
            response.code="0";
            response.msg="调用失败";
            response.pptdata=[];
            response.uid= uid;
            response.title = "hoozha";
            res.render('main', {"uid":uid,"ppts":response.pptdata});
        }else{
            response.code="1";
            response.msg="调用成功";
            response.pptdata= rows;
            response.uid= uid;
            response.title = "hoozha";
            res.render('main', {"uid":uid,"ppts":response.pptdata});
        }
    });
}
