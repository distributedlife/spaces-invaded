module.exports = function(io, game_state, user_input, watchjs, measure) {
	var setup_playable_client = function(socket) {
		// measure.socket(socket);

		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { user_input.raw_data = input_data; });
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });
		socket.on('resize', function(dimensions) { game_state.dimensions = dimensions });

		console.log(game_state.invaders[0].type);
		socket.emit("game_state/setup", game_state);

		// var push_data_to_client = function() { 
		// 	socket.volatile.emit("game_state/update", game_state) 
		// 	setTimeout(push_data_to_client, 1000 / 60);
		// };

		// watchjs.measured_watch('game_state', game_state, socket.volatile.emit("game_state/update", game_state));
		watchjs.watch(game_state, socket.volatile.emit("game_state/update", game_state));
		game_state.players += 1;

		// push_data_to_client();
	}

	var setup_controller = function(socket) {
		// measure.socket(socket);

		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { user_input.raw_data = input_data; });
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });

		game_state.players += 1;
	}

	var setup_observer = function(socket) {
		// measure.socket(socket);
		
		socket.on('disconnect', function() { 
			game_state.observers -= 1; 
		});
		//TODO: what happens when the observer screen resolution is different to the player screen resolution?
		socket.emit("game_state/setup", game_state);
		watchjs.watch(game_state, function() { socket.volatile.emit("game_state/update", game_state) });
		
		game_state.observers += 1;
	}

	io.of('/desktop').on('connection', setup_playable_client);
	io.of('/controller').on('connection', setup_controller);
	io.of('/mobile').on('connection', setup_playable_client);
	io.of('/gamepad').on('connection', setup_playable_client);

	io.of('/observer').on('connection', setup_observer);
};