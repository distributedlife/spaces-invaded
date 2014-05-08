varying vec2 tc;
uniform sampler2D decal; 

void main() { 
	gl_FragColor = texture2D(decal, tc); 
}