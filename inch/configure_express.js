var morgan = require('morgan');
var bodyParser = require('body-parser')

module.exports = function(app, express, engines) {
	app.use('/client', express.static(__dirname + '/client'));
	app.use('/game/client', express.static(__dirname + '/../game/client'));
	app.use(morgan());
	app.use(bodyParser());  
	app.set('view options', {layout: false});
	app.set('views', __dirname + '/views');
	app.engine('haml', engines.haml);
};