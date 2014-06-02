define(['lib/particle_effect', 'lib/config', 'lib/temporary_effect', 'lodash'], function(ParticleEffect, config, temporary_effect, _) {
	"use strict";

	return {
		make: function() {
			var effect_duration = 4.0;

			var effect = new ParticleEffect(
				{
			        texture: THREE.ImageUtils.loadTexture(config.resolve_lib_image("smokeparticle.png")),
			        maxAge: 0.5,
			        hasPerspective: 0
			    },
			    [{
			        acceleration: new THREE.Vector3(0, -100, 0),
        			accelerationSpread: new THREE.Vector3( 10, 0, 10 ),
			        velocity: new THREE.Vector3(0, 15, 0),
        			velocitySpread: new THREE.Vector3(10, 7.5, 10),
			        particlesPerSecond: 50,
			        particleCount: 5,
			        colorStart: new THREE.Color('orange'),
        			colorEnd: new THREE.Color('red'),
			        sizeStart: 10,
			        opacityStart: 1.0,
			        opacityEnd: 0.0,
			        alive: 1.0
			    }]
			);

			_.extend(effect, temporary_effect(effect_duration, function(dt) {
				if (!this.is_alive()) {
					this.kill_off();
				}

				this.group.tick(dt);
			}.bind(effect)));

			return effect;
		}
	};
});