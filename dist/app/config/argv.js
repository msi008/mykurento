var minimist = require('minimist');
var fs    = require('fs');
var Constants = require ('../constants');

var argv = minimist(process.argv.slice(2), {
	default: {
		as_uri: Constants.AS_URI,
		ws_uri: Constants.WS_URI
	}
});

module.exports = argv;