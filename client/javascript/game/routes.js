module.exports = function(app, game_state) {
	app.get('/display', function(request, response) {
		response.render('display.haml');
	});

	app.get('/controller', function(request, response) {
		response.render('controller.haml');
	});

	app.get("/new", function(request, response) {
		game_state.reset();
	});
};
