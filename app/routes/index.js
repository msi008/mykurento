var express = require('express');
var router = express.Router();
var logger = require('../../log').logger;
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
     logger.error("route index root");
  res.render('index', { title: 'Express' });
});
router.get('/:room', function(req, res) {
    logger.error("route index room");
	res.render('room', { title : 'Express' });
});
// exports.home = function (req,res){
// 	// var userinfo = tools.getUserInfo(req, res);
// 	// var uid = userinfo.uid;
// 	// var type = userinfo.type;
// 	res.render('index');
// };
router.get(/^\/login\/result1/, function(req, res) {
    console.log('打印参数result1 ', req.query);
    res.end('ok');
});
router.get(/^\/login\/result2/, function(req, res) {
    console.log('打印参数 result2 ', req.query);
    res.end('ok');
});

module.exports = router;
