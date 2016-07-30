var express = require('express')
,passport=require('passport')
,util=require('util')
,oauth = require('../config/oauth')
,WeiboStrategy = require('passport-weibo').Strategy;

var router = express.Router();

/* GET users listing. */
var option = oauth.weibo;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(new WeiboStrategy({
        clientID: option.client_id,
        clientSecret: option.client_secret,
        callbackURL: option.redirect_uri
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Weibo profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Weibo account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

router.get('/logon/weibo',
    passport.authenticate('weibo'),
    function(req, res){

        console.log(req);
        // The request will be redirected to Weibo for authentication, so this
        // function will not be called.
    });

router.get('/logon/weibo/callback',
    passport.authenticate('weibo', { failureRedirect: '/login' }),
    function(req, res) {
        // console.log(req,11);
        console.log(req.user,1231);
        res.render('weibo', { user: req.user });
        // res.redirect('/');
    });
module.exports = router;
