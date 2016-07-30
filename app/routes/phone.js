var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user/create_phone', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('telphone', { title: 'Express' });
});
module.exports = router;
