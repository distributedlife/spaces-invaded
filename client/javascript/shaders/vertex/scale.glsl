uniform lowp float from_scale;
uniform lowp float to_scale;
uniform lowp float progress;
varying vec2 tc; 

float lerp(float from, float to, float t) {
	return (1.0 - t) * from + to * t;
}

void main() { 
	tc = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position * vec3(lerp(from_scale, to_scale, progress)), 1.0);
}