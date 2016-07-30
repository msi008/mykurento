var fs = require('fs'),
	path = require('path');

var key_opts =
{
  // key:  fs.readFileSync('keys/server.key'),
  // cert: fs.readFileSync('keys/server.crt')
  //path.join(__dirname,);  //如果在根下，不需要加__dirname用于区分；
  key: fs.readFileSync('fake-keys/server.key'),
  cert: fs.readFileSync('fake-keys/server.pem'),
  ca: fs.readFileSync('fake-keys/server.crt')
};
module.exports = key_opts;