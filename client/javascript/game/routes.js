module.exports = function(app, game_state) {
	app.get('/', function(request, response) {
		response.render('index.haml');
	});

	app.get('/observer', function(request, response) {
		response.render('observer.haml');
	});

	app.get('/desktop', function(request, response) {
		response.render('display.haml');
	});

	app.get('/controller', function(request, response) {
		response.render('controller.haml');
	});

	app.get("/editor", function(request, response) {
		response.render('json.haml');
	});

	app.get("/data", function(request, response) {
		response.json(game_state);
	});

	app.post("/data", function(request, response) {
		game_state = request.body;
	});
};
