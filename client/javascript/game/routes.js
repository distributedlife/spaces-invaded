module.exports = function(app, game_state, measure) {
	app.get("/metrics", function(req, res) { res.json(measure.results()); });

	// measure.routes(app);

	app.get('/', function(req, res) { res.render('index.haml'); });

	app.get('/observer', function(req, res) { res.render('observer.haml'); });
	app.get('/desktop', function(req, res) { res.render('display.haml'); });
	app.get('/controller', function(req, res) { res.render('controller.haml'); });
	app.get('/diagnostics', function(req, res) { res.render('diagnostics.haml'); });
	app.get('/mobile', function(req, res) { res.render('mobile.haml'); });

	app.get("/editor", function(req, res) { res.render('json.haml'); });
	app.get("/data", function(req, res) { res.json(game_state); });
	app.post("/data", function(req, res) { game_state = req.body; });
};
