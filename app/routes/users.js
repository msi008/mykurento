var express = require('express');
var router = express.Router();
var wxoauth = require('../routes/wxoauth')
    ,weibooauth = require('../routes/weibooauth')
    ,index = require('../routes/index');
passport=require('passport')    //用passport需要在这里引一下

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('i am user');
})
router.get('/logon',function(req,res){
  res.render('index');
});
router.get('/:uid', function(req, res){
  res.send("i am user/uid");
});
//微信oauth
router.get('/logon/wechatoauth',wxoauth.wxoauth);
router.get('/wxoauth/callback',wxoauth.wxoauthCallback);

//微博oauth
router.use(passport.initialize());
router.get('/logon/weibo',weibooauth);
router.get('/logon/weibo/callback',weibooauth);
module.exports = router;
