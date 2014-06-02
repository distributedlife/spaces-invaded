define(["ext/three"], function(THREE) {
	"use strict";

	return function(fontData) {
		if (_typeface_js && _typeface_js.loadFace) {
			_typeface_js.loadFace(fontData);
		};

		return fontData;
	}
});