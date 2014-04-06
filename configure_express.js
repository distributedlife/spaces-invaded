module.exports = function(app, express, engines) {
	app.use('/client', express.static(__dirname + '/client'));
	app.use(express.urlencoded());
	app.use(express.json());  
	app.set('view options', {layout: false});
	app.engine('haml', engines.haml);
};