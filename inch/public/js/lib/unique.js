define([], function() {
	"use strict";

	var id = 0;

	return {
		id: function () { return ++id; }
	};
});