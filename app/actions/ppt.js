/**
 * ppt controller
 */
var logger = require("../../log").logger;
var ppt = require("../models/PPTDb");
var tools = require("./tools");
var ppt_lib = require('../constants');
exports.getPPT = function(req,res){
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
            res.render('room', {"uid":uid,"ppts":response.pptdata});
        }else{
            response.code="1";
            response.msg="调用成功";
            response.pptdata= rows;
            response.uid= uid;
            response.title = "hoozha";
            res.render('room', {"uid":uid,"ppts":response.pptdata});
        }
    });
};


/**
 * 获取PPT
* @param req
* @param res
*/
exports.loadppt = function(req, res){
    //var uid = tools.getUserId(req, res);
    //var userdata = tools.getUserInfo(req, res);
    //var nickname = userdata.nickname;
    //var type = userdata.type;
    var rid = req.body.rid;
    tools.getPreview(rid, function(data){
        res.json({code : 1, data:data});
    });
};


/**
 * 上传PPT
 * @param req
 * @param res
 */
exports.upload = function(req, res){
//  res.render('upload', { title: 'Express' });
    var body = "";
    if(req.body.rid){
        var http = require('http');
        var url = ppt_lib.preview_url + req.body.rid+'.json';

        http.get(url, function(response) {
            console.log("Got response: " + response.statusCode);
            response.on('data', function (chunk) {
                console.log('buff length:' + chunk.length);
                body += chunk;
            });
            response.on('end', function(){

                /**  {"code":1,"name":"MTBI性格理论：赢在性格.pptx",
					 * "rid":"group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00_pptx",
					 * "url":null,"totalSize":1,"curPage":1,"totalPage":1,
					 * "pageSize":10,
					 * "data":[{"title":null,"content":null,
					 * "url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide1.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide10.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide11.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide12.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide13.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide14.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide15.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide16.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide17.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide18.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide19.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide2.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide20.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide21.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide22.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide23.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide24.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide25.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide26.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide27.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide28.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide29.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide3.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide30.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide31.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide4.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide5.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide6.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide7.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide8.jpg","note":null},{"title":null,"content":null,"url":"http://doc.tt139.com/data/group1M00/02B7wKgzO/6g62A/group1M0002B7wKgzOVH_f37Q6g62AFw-zpl83CU10_M00/slide9.jpg","note":null}],"styleUrl":null,"desc":"Success"}
                 */
                var obj = JSON.parse(body);
                console.log("upload *********   "+JSON.stringify(obj));
                var response = {};
                if(obj.code == "1" && obj.data.length>0){
                    response.code='1';
                    response.msg="解析成功";
                    response.data={};
                    response.data.cover_image=obj.data[0].url;
                    response.data.ppt_name=obj.name;
                    response.data.ppt_id=req.body.rid;
                    response.data.tt_uid = req.body.tt_uid;
                    response.data.ppt_size=req.body.size;
                    response.data.slide_num=obj.data.length;
                    response.data.upload_time=new Date();
                    console.log("uplaod time "+response.data.upload_time);

                    ppt.insertPPTcollections(response.data,function(err,result){
                        if(err){//失败
                            response.code="0";
                            response.msg="解析失败";
                            response.data={};
                            res.json(response);
                        }else{
                            ppt.insertPPTuploadrecord(response.data,function(err,result){
                                if(err){
                                    response.code="0";
                                    response.msg="解析失败";
                                    response.data={};
                                    res.json(response);
                                } else{
                                    response.data.upload_time = response.data.upload_time.getTime();
                                    res.json(response);

                                }
                            });

                        }
                    });

                }else{

                    response.code="0";
                    response.msg="解析失败";
                    response.data={};
                    res.json(response);
                }
            });
        }).on('error', function(e) {
            response.code="0";
            response.msg="解析失败";
            response.data={};
            res.json(response);
            console.log("Got error: " + e.message);
        });
    }else{
        response.code="0";
        response.msg="解析失败";
        response.data={};
        res.json(response);
    }
};
