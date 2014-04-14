module.exports = function(app, game_state, measure) {
	app.get("/metrics", function(req, res) { res.json(measure.results()); });

	measure.routes(app);

	app.measured('/', 'get', function(req, res) { res.render('index.haml'); });

	app.measured('/observer', 'get', function(req, res) { res.render('observer.haml'); });
	app.measured('/desktop', 'get', function(req, res) { res.render('display.haml'); });
	app.measured('/controller', 'get', function(req, res) { res.render('controller.haml'); });
	app.measured('/diagnostics', 'get', function(req, res) { res.render('diagnostics.haml'); });
	app.measured('/mobile', 'get', function(req, res) { res.render('mobile.haml'); });

	app.get("/editor", function(req, res) { res.render('json.haml'); });
	app.get("/data", function(req, res) { res.json(game_state); });
	app.post("/data", function(req, res) { game_state = req.body; });
};
