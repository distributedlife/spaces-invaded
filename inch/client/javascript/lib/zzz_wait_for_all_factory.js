define(['lib/wait_for_all'], function(WaitForAll) {
	"use strict";

	return function() {
		var factory = this;

		factory.build = function(method, clients, event_to_wait_on, continuation) {
			return new WaitForAll(method, clients, event_to_wait_on, continuation);
		};

		return factory;
	};
});