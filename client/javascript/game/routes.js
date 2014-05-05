module.exports = function(app, game_state) {
	app.get('/', function(req, res) { res.render('index.haml'); });

	app.get('/observer', function(req, res) { res.render('observer.haml'); });
	app.get('/primary', function(req, res) { res.render('primary.haml'); });
	app.get('/controller', function(req, res) { res.render('controller.haml'); });
	app.get('/diagnostics', function(req, res) { res.render('diagnostics.haml'); });
	app.get('/mobile', function(req, res) { res.render('mobile.haml'); });

	app.get("/editor", function(req, res) { res.render('json.haml'); });
	app.get("/data", function(req, res) { res.json(game_state); });
	app.post("/data", function(req, res) { game_state = req.body; });
};
