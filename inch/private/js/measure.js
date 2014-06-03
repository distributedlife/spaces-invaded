var microtime = require('microtime');
var _ = require('underscore');
var config = require('../lib/config');

var measure = {
	server_start: microtime.now(),
	data: {
		sockets: {
			active: [],
			inactive: []
		}
	},
	original: function(func, thisObject) {
		return function() {
	        return func.apply(thisObject || this, Array.prototype.slice.call(arguments));
		};	
	},
	t: function(name, func, thisObject) {	
		if (!config.measure) { 
			return this.original(func, thisObject);
		}

		this.data[name] = this.data[name] || [];

		return function() {
			var args = Array.prototype.slice.call(arguments);

	        var start = microtime.now();
	        var result = func.apply(thisObject || this, args);
			var finish = microtime.now();

			this.data[name].push(finish-start);

	        return result;
		};
	},
	buckets: function(name, func, thisObject) {
		if (!config.measure) { 
			return this.original(func, thisObject);
		}

		this.data[name] = this.data[name] || {'<=100us': 0, '1ms+': 0, '16ms+': 0, '100ms+': 0, '1s+': 0};

		return function() {
			var args = Array.prototype.slice.call(arguments);

	        var start = microtime.now();
	        var result = func.apply(thisObject || this, args);
			var finish = microtime.now();

			var duration = finish - start;
			if (duration <= 100) {
				this.data[name]['<=100us'] += 1;
			} else if (duration <= 1000) {
				this.data[name]['1ms+'] += 1;
			} else if (duration <= 16000) {
				this.data[name]['16ms+'] += 1;
			} else if (duration <= 100000) {
				this.data[name]['100ms+'] += 1;
			} else {
				this.data[name]['1s+'] += 1;
			}

	        return result;
		};
	},
	stop: function(disconnected_socket, func, thisObject) {
		if (!config.measure) { 
			return this.original(func, thisObject);
		}

		var measure = this;
		
		return function() {
			var to_remove = [];
			_.each(measure.data.sockets.active, function(socket) {
				if (socket.id === disconnected_socket.id) {
					socket.finish = microtime.now();
					socket.duration = socket.finish - socket.start;
					measure.data.sockets.inactive.push(socket);
					to_remove.push(measure.data.sockets.active.indexOf(socket));
				}
			}.bind(measure));			

			_.each(to_remove, function(index) {
				measure.data.sockets.active.splice(index, 1);
			});
			
			var args = Array.prototype.slice.call(arguments);
			return func.apply(thisObject || this, args);
		}
	},
	socket: function(s) {
		if (!config.measure) { return; }

		var measure = this;

		s.old_on = s.on;
		s.on = function(name, callback) {
			if (name === "disconnect") {
				return s.old_on(name, measure.stop(s, measure.buckets("event:"+name, callback, s).bind(measure)));
			} else {
				return s.old_on(name, measure.buckets("event:"+name, callback, s).bind(measure));
			}
		};

		this.data.sockets.active.push({ 'id': s.id, 'start': microtime.now() });
	},
	routes: function(app) {
		var measure = this;

		if (!config.measure) {
			app.measured = function(route, verb, callback) {
				return app[verb](route, callback);
			};
		} else {
			app.measured = function(route, verb, callback) {
				return app[verb](route, measure.buckets(route, callback, app).bind(measure));
			};
		}
	},
	watchjs: function(watchjs) {
		var measure = this;

		if (!config.measure) {
			watchjs.measured_watch = function(name, data, callback) {
				return watchjs.watch(data, callback);
			}
		} else {
			watchjs.measured_watch = function(name, data, callback) {
				return watchjs.watch(data, measure.buckets(name, callback, watchjs).bind(measure));
			}
		}
	},
	anything: function(func, thisObject) {
		return this.t(func.toString(), func, thisObject);
	},
	calculate_uptime: function(start) {
		return (microtime.now() - start) / 1000000;
	},
	results: function() {
		this.data.server_uptime = this.calculate_uptime(this.server_start);
		_.each(this.data.sockets.active, function(socket) { socket.duration = this.calculate_uptime(socket.start); }.bind(this));

		return this.data;
	}
};
module.exports = measure;