"use strict";

var express = require('express');
var app = express();
require('./configure_express')(app, express, require('consolidate'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1); 

var entities = {
  bullet: require('./server/javascript/game/bullet'),
  tank: require('./server/javascript/game/tank')
}
var user_input = {
	raw_data: {}
};

var measure = require('./server/javascript/lib/measure')
var watchjs = require('watchjs');
measure.watchjs(watchjs);

var game_state = require('./server/javascript/game/state')(entities);
var game_logic = require('./server/javascript/game/logic')(game_state);
var action_map = require('./server/javascript/game/action_map');
require('./client/javascript/game/routes')(app, game_state, measure);

require('./server/javascript/lib/socket_routes')(io, game_state, user_input, watchjs, measure);
var input_bindings = require('./server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs);
var game_engine = require('./server/javascript/lib/engine')(game_state, game_logic, input_bindings, measure);

game_engine.run();

require('./requirejs_node_config')(require('requirejs'));
server.listen(process.env.PORT || 3000);