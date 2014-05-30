define(['lib/particle_effect', 'lib/config'], function(ParticleEffect, config) {
	"use strict";

	return {
		make: function() {
			return new ParticleEffect(
				{
			        texture: THREE.ImageUtils.loadTexture(config.resolve_lib_image("particle.png")),
			        maxAge: 1,
			        hasPerspective: 0
			    },
			    [{
			        acceleration: new THREE.Vector3(0, 10, 0),
			        velocity: new THREE.Vector3(0, 10, 0),
			        particlesPerSecond: 5,
			        sizeStart: 20,
			        sizeEnd: 0,
			        colorStart: new THREE.Color('white'),
			        colorEnd: new THREE.Color('red'),
			        alive: 0.0
			    }]
			);
		}
	};
});