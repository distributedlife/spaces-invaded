var morgan = require('morgan');
var bodyParser = require('body-parser')

module.exports = function(app, express, engines) {
	app.use('/client', express.static(__dirname + '/client'));
	app.use(morgan());
	app.use(bodyParser());  
	app.set('view options', {layout: false});
	app.engine('haml', engines.haml);
};