exports.sendEmail = function (req, res) {  
  
    var data = {  
        address: 'http://sms.handword.com/sms/sendsms?mobile=15210642389&msg_content=%22%E6%88%91%E6%98%AF%E5%B0%8F%E9%A9%AC%E4%B8%BA%E4%BA%86%E6%B5%8B%E8%AF%95%E6%88%91%E6%98%AF%E5%B0%8F%E9%A9%AC%E4%B8%BA%E4%BA%86%E6%B5%8B%E8%AF%95%E6%88%91%E6%98%AF%E5%B0%8F%E9%A9%AC%E4%B8%BA%E4%BA%86%E6%B5%8B%E8%AF%95%22',  
        subject: "usercenter"  
    };  
  
    data = require('querystring').stringify(data);  
    console.log(data);  
    var opt = {  
        method: "POST",  
        host: "localhost",  
        port: 8080,  
        path: "/v1/sendEmail",  
        headers: {  
            "Content-Type": 'application/x-www-form-urlencoded',  
            "Content-Length": data.length  
        }  
    };  
  
    var req = http.request(opt, function (serverFeedback) {  
        if (serverFeedback.statusCode == 200) {  
            var body = "";  
            serverFeedback.on('data', function (data) { body += data; })  
                          .on('end', function () { res.send(200, body); });  
        }  
        else {  
            res.send(500, "error");  
        }  
    });  
    req.write(data + "\n");  
    req.end();  
} 