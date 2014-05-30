uniform lowp vec4 from_colour;
uniform lowp vec4 to_colour;
uniform lowp float progress;

#include lerp.glsl

void main() { 
	gl_FragColor = lerp(from_colour, to_colour, progress);
}