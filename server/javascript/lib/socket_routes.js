module.exports = function(io, game_state, user_input, watchjs) {
	var start_update_client_loop = function(socket) {
		var update_client = function() {
			socket.volatile.emit("game_state/update", game_state) 
			setTimeout(update_client, 1000 / 60);
		}
		setTimeout(update_client, 1000 / 60);
	};

	var setup_playable_client = function(socket) {
		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { user_input.raw_data = input_data; });
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });
		socket.on('resize', function(dimensions) { game_state.dimensions = dimensions });

		socket.emit("game_state/setup", game_state);

		start_update_client_loop(socket);

		game_state.players += 1;
	};

	var setup_controller = function(socket) {
		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { user_input.raw_data = input_data; });
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });

		game_state.players += 1;
	};

	var setup_observer = function(socket) {
		socket.on('disconnect', function() { 
			game_state.observers -= 1; 
		});

		//TODO: what happens when the observer screen resolution is different to the player screen resolution?
		socket.emit("game_state/setup", game_state);
		
		start_update_client_loop(socket);
		
		game_state.observers += 1;
	};

	io.of('/desktop').on('connection', setup_playable_client);
	io.of('/controller').on('connection', setup_controller);
	io.of('/mobile').on('connection', setup_playable_client);
	io.of('/gamepad').on('connection', setup_playable_client);

	io.of('/observer').on('connection', setup_observer);
};