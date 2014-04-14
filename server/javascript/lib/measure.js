var microtime = require('microtime');
var _ = require('underscore');

var measure = {
	server_start: microtime.now(),
	data: {
		sockets: []
	},
	t: function(name, func, thisObject) {	
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
	distribution: function(name, func, thisObject) {
		this.data[name] = this.data[name] || {'<=10': 0, '<=100': 0, '<=1000': 0, '1000+': []};

		return function() {
			var args = Array.prototype.slice.call(arguments);

	        var start = microtime.now();
	        var result = func.apply(thisObject || this, args);
			var finish = microtime.now();

			var duration = finish - start;
			if (duration <= 10) {
				this.data[name]['<=10'] += 1;
			} else if (duration <= 100) {
				this.data[name]['<=100'] += 1;
			} else if (duration <= 1000) {
				this.data[name]['<=1000'] += 1;
			} else {
				this.data[name]['1000+'].push(duration);
			}

	        return result;
		};
	},
	socket: function(socket) {
		var measure = this;

		var old_on = socket.on;
		socket.on = function(name, callback) {
			return old_on(name, measure.event(name, callback, socket));
		};

		this.data.sockets.push({ 'id': socket.id, 'start': microtime.now() });
	},
	routes: function(app) {
		var measure = this;

		app.measured = function(route, verb, callback) {
			return app[verb](route, measure.t(route, callback, app).bind(measure));
		};
	},
	watchjs: function(watchjs) {
		var measure = this;

		watchjs.measured_watch = function(name, data, callback) {
			return watchjs.watch(data, measure.t(name, callback, watchjs).bind(measure));
		}
	},
	event: function(name, func, thisObject) {
		return this.t("event:"+name, func, thisObject);
	},
	anything: function(func, thisObject) {
		return this.t(func.toString(), func, thisObject);
	},
	calculate_uptime: function(start) {
		return microtime.now() - start;
	},
	results: function() {
		this.data.server_uptime = this.calculate_uptime(this.server_start);
		_.each(this.data.sockets, function(socket) {
			socket.duration = this.calculate_uptime(socket.start);
		}.bind(this));

		return this.data;
	}
};
module.exports = measure;