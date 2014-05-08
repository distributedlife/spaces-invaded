varying vec2 tc; 

void main() { 
	tc = uv; 
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}