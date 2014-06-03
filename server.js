"use strict";

var inch_files = "./inch";
var _ = require('underscore');
var express = require('express');
var app = express();
require(inch_files+'/configure_express')(app, express, require('consolidate'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//TODO: renable when re-introduced to socket.io
// io.enable('browser client minification');
// io.enable('browser client etag');
// io.enable('browser client gzip');

var server_lib_files = inch_files+'/private/js'
var server_game_files = './game/server/js'
var client_game_files = './game/client/js'

var game_state = require(server_lib_files+'/state');

var entities = {
  bullet: require(server_game_files+'/bullet'),
  tank: require(server_game_files+'/tank'),
  invader: require(server_game_files+'/invader'),
  swarm: require(server_game_files+'/swarm')
}
var user_input = {
	raw_data: {}
};

var watchjs = require('watchjs');

_.extend(game_state, require(server_game_files+'/state')(entities));

var game_logic = require(server_game_files+'/logic')(game_state);
var action_map = require(server_game_files+'/action_map');

require(server_lib_files+'/socket_routes')(io, game_state, user_input, watchjs);
require(client_game_files+'/routes')(app, game_state);

var input_bindings = require(server_lib_files+'/input_bindings')(game_state, user_input, action_map, watchjs);
var game_engine = require(server_lib_files+'/engine')(game_state, game_logic, input_bindings);

game_engine.run();

require(inch_files+'/requirejs_node_config')(require('requirejs'));
server.listen(process.env.PORT || 3000);