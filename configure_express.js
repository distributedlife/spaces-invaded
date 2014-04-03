module.exports = function(app, express, engines) {
	app.use('/client', express.static(__dirname + '/client'));
	app.set('view options', {layout: false});
	app.engine('haml', engines.haml);
};