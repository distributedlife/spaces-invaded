define(["zepto"], function($) {
	"use strict";

	return {
		pause: function() { $('.paused').show(); },
        resume: function() { $('.paused').hide(); },
        disconnected: function() { $('.disconnected').show(); },
        connected: function() { $('.disconnected').hide(); },
	};
});