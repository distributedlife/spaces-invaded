"use strict";

var express = require('express');
var app = express(express.logger());
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var entities = {
  bullet: require('./server/javascript/game/bullet'),
  tank: require('./server/javascript/game/tank')
}
var user_input = {
	raw_data: {}
};

var game_state = require('./server/javascript/game/state')(entities);
var game_logic = require('./server/javascript/game/logic')(game_state);
var action_map = require('./server/javascript/game/action_map');
require('./client/javascript/game/routes')(app, game_state);

require('./server/javascript/lib/socket_routes')(io, game_state, user_input);
var input_bindings = require('./server/javascript/lib/input_bindings')(game_state, user_input, action_map);
var game_engine = require('./server/javascript/lib/engine')(game_state, game_logic, input_bindings);

game_engine.run();

require('./requirejs_node_config')(require('requirejs'));
require('./configure_express')(app, express, require('consolidate'));
server.listen(process.env.PORT || 3000);