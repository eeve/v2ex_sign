const debug = require('debug');
const logTypes = [ 'http', 'dom', 'debug', 'info', 'error' ];

module.exports = function(prefix){
	var Log = {};
	prefix = prefix || '';
	logTypes.forEach((type) => {
		Log[type] = debug(prefix + ':' + type);
	});
	return Log;
};
