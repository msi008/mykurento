/**
 * Created by Administrator on 2016/7/26 0026.
 */
var request = require('request');
exports.invite = function(req,res){
    res.render('invite');
}
exports.sendmessage = function(req,res){
    var mobile = req.body.mobile;
    var msg_content = req.body.msg_content;
    console.log(mobile);
    //var url = "http://www.baidu.com";
    var url = "http://sms.handword.com/sms/sendmessage?mobile="+mobile+"&msg_content="+msg_content;
    console.log(url);
    request.post(url, {form:{'mobile':mobile,'msg_content':msg_content}}, function (error, response, body){
        if (!error && response.statusCode == 200) {
            console.log(body) // 打印google首页
            res.json({code:"1",msg:"发送短信成功"});
        }else{
            res.json({code:"2",msg:"发送短信失败"});
        }
    });

}