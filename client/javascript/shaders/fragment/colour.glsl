uniform lowp vec4 from_colour;
uniform lowp vec4 to_colour;
uniform lowp float progress;

float lerp(float from, float to, float t) {
	return (1.0 - t) * from + to * t;
}

vec4 lerp(vec4 from, vec4 to, float t) {
	return vec4
	(
		lerp(from[0], to[0], t),
		lerp(from[1], to[1], t),
		lerp(from[2], to[2], t),
		lerp(from[3], to[3], t)
	);
}

void main() { 
	gl_FragColor = lerp(from_colour, to_colour, progress);
}