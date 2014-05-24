define(['lib/particle_engine'], function(ParticleEngine) {
	"use strict";

	return function(group_options, emitter_options_array) {
		var rocket_trail = {
			group: new ParticleEngine.Group(group_options),
			emitters: [],
			tick: function(dt) {
				this.group.tick(dt);
			},
			mesh: function() {
				return this.group.mesh;
			},
			update_from_model: function(updated_model) {
				_.each(this.emitters, function(emitter) {
					emitter.position.x = updated_model.x;
                	emitter.position.y = updated_model.y;
                	emitter.alive = updated_model.active
                });
			}
		};

		_.each(emitter_options_array, function(emitter_options) {
			var emitter = new ParticleEngine.Emitter(emitter_options);
			
			rocket_trail.emitters.push(emitter);
			rocket_trail.group.addEmitter(emitter);
		});

		return rocket_trail;
	};
});