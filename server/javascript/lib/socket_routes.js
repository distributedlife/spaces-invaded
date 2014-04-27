module.exports = function(io, game_state, user_input, watchjs) {
	var setup_playable_client = function(socket) {
		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { user_input.raw_data = input_data; });
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });
		socket.on('resize', function(dimensions) { game_state.dimensions = dimensions });

		console.log("MIKE: THAT SAME OBJECT NOW SHOWS MORE THINGS BY THE TIME WE GET HERE.")
		console.log(game_state.invaders[0]);
		console.log("MIKE: BUT TYPE AND OTHERS STILL DOESN'T SHOW UNLESS WE ARE EXPLICIT:"+game_state.invaders[0].type)
		console.log("MIKE: THE TROUBLE IS THAT WHEN I GET HERE, THE SOCKET.EMIT ONLY SENDS WHAT IT CAN SEE. IT CANT SEE TYPE SO THE CLIENT DOESN'T GET IT. THIS USED TO WORK. I DON'T UNDERSTAND WHY IT NO LONGER DOES");
		socket.emit("game_state/setup", game_state);

		watchjs.watch(game_state, socket.volatile.emit("game_state/update", game_state));
		game_state.players += 1;
	}

	var setup_controller = function(socket) {
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