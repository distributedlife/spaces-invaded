define([
    "zepto", "lodash", "lib/orthographic_display", "lib/config", "lib/sprite", "lib/window", 'lib/audio_emitter', 
    'game/score', 'lib/orthographic_text', 'font/helvetiker_regular', 'lib/particle/rocket_trail', 'lib/particle/temporary/ground_explosion',
    'lib/wireframe'],
  function($, _, OrthographicDisplay, config, sprite, window, audio_emitter, 
    score, orthographic_text, helvetiker_regular, RocketTrail, GroundExplosion, wireframe)
  {
    "use strict";

    return function(element, width, height, options) {
        var screen_width = function(state) { return state.dimensions.width; };
        var screen_height = function(state) { return state.dimensions.height; };

        var tank = null;
        var bullet = null;
        var invader_bullets = {};
        var invaders = {};

        var tank_die = null;
        var tank_bullet_fire = null;

        var scoreText = {};
        var rocket_trail = null;

        var fires = {};

        var wireframes = {};

        var create_death_score = function(invader) {
            var death_score = new orthographic_text(
                client.values[invader.type], 
                {
                    duration: 0.5,
                    transparent: true, 
                    scale: {from: 1, to: 5},
                    colour: {
                        from: [1.0, 1.0, 1.0, 1.0],
                        to: [1.0, 0.0, 0.0, 0.0]
                    }
                }
            );
            death_score.update_from_model({x: invader.x, y: invader.y});

            client.add_to_scene(death_score.mesh);
            client.temporary_effects.push(death_score);
        };

        var when_tank_changes = function(model, prior_model) {
            tank.update_from_model(model);
            tank_die.update_from_model(model);
        };

        var when_tank_bullet_changes = function(model, prior_model) {
            bullet.update_from_model(model); 
            tank_bullet_fire.update_from_model(model);
            rocket_trail.update_from_model(model);
        };

        var when_an_invader_bullet_changes = function(model, prior_model) {
            invader_bullets[model.id].sprite.update_from_model(model);
            invader_bullets[model.id].audio.fire.update_from_model(model);
            invader_bullets[model.id].audio.miss.update_from_model(model);
        };

        var when_an_invader_changes = function(model, prior_model) {
            invaders[model.id].sprite.update_from_model(model);
            invaders[model.id].audio.die.update_from_model(model);

            if (prior_model === null) {
                return;
            }
            if (!model.active && prior_model.active) {
                create_death_score(model);
            }
        };

        var game_over_man = function(model, prior_model) {
            console.log("TODO: implement game over man");
        };

        var a_fire_lit = function(model, prior_model) {
            var fire = GroundExplosion.make({id: model.id});
            fire.update_from_model({x: model.x, y: model.y, active: true});

            client.add_to_scene(fire.mesh());
            client.temporary_effects.push(fire);

            fires[model.id] = fire;
        };

        var a_fire_extinguished = function(model, prior_model) {
            fires[model.id].kill_off();
            fires[model.id] = null;
        };


        //TODO: move up
        var add_wireframe = function(model, prior_model) {
            if (wireframes[model.id] !== undefined) {
                wireframes[model.id].show();  
                return;
            }

            var bb_wireframe = new wireframe(model, {});
            _.each(bb_wireframe.meshes, function(mesh) {
                client.add_to_scene(mesh);
            });

            wireframes[model.id] = bb_wireframe;
        };

        var move_wireframe = function(model, prior_model) {
            if (wireframes[model.id] === undefined) { add_wireframe(model, prior_model); }

            wireframes[model.id].update_from_model(model);
        };

        var remove_wireframe = function(model, prior_model) {
            if (wireframes[model.id] === undefined) { return; }

            wireframes[model.id].hide();  
        };



        var setup = function() {
            tank = Object.create(sprite(client.value(client.the('tank')), config.resolve_game_image('tank.png'), {}));
            tank_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_die.mp3'), {}, client.isnt('active')));
            tank_bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_bullet.mp3'), {}, client.is('active')));
            client.add_to_scene(tank.mesh);


            bullet = Object.create(sprite(client.value(client.the('bullet')), config.resolve_game_image('tank_bullet.png'), {}));
            client.add_to_scene(bullet.mesh);


            scoreText = Object.create(orthographic_text(
                client.score, 
                {
                    alignment: { 
                        horizontal: "right", 
                        vertical: "top"
                    }
                }
            ));
            scoreText.update_from_model({x: client.value(screen_width) - 10, y: 0});
            client.add_to_scene(scoreText.mesh);



            _.each(client.value(client.all('invader_bullets')), function(bullet) {
                var bullet_sprite = Object.create(sprite(bullet, config.resolve_game_image('invader_bullet.png'), {}));
                var bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_bullet_fire.wav'), { volume: 40}, client.is('active')));
                var bullet_miss = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_bullet_miss.wav'), { volume: 30}, client.isnt('active'))); 

                invader_bullets[bullet.id] = {
                    sprite: bullet_sprite,
                    audio: {
                        fire: bullet_fire,
                        miss: bullet_miss
                    }
                };

                client.add_to_scene(bullet_sprite.mesh);
            });
            

            _.each(client.value(client.all('invaders')), function(invader) {
                var invader_sprite = Object.create(sprite(invader, config.resolve_game_image("invader_"+invader.type+".png"), {}));
                var invader_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_die.mp3'), {volume: 25}, client.isnt('active')));

                invaders[invader.id] = {
                    sprite: invader_sprite,
                    audio: {
                        die: invader_die
                    }
                };
                client.add_to_scene(invader_sprite.mesh);
            });
            

            var soundtrack = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('soundtrack.mp3'), {volume: 75}));
            soundtrack.play();


            rocket_trail = RocketTrail.make();
            client.add_to_scene(rocket_trail.mesh());
            client.permanent_effects.push(rocket_trail);


            client.on_change(client.the('tank'), when_tank_changes);
            client.on_conditional_change(client.the('tank'), client.isnt('active'), game_over_man);
            client.on_change(client.the('bullet'), when_tank_bullet_changes);
            client.on_element_change(client.all('invader_bullets'), when_an_invader_bullet_changes);
            client.on_element_change(client.all('invaders'), when_an_invader_changes);
            client.on_element_arrival(client.all('fires'), a_fire_lit);
            client.on_element_removal(client.all('fires'), a_fire_extinguished);

            var earth = Object.create(sprite({width: width, height: 64, x: 600, y: height, z: 10}, config.resolve_game_image('earth.png'), {transparent: false}));
            client.add_to_scene(earth.mesh);

            var sky = Object.create(sprite({width: client.value(screen_width), height: client.value(screen_height) * 2, x: client.value(screen_width) / 2, y: client.value(screen_height) / 2 + 64, z: 10}, config.resolve_game_image('sky.png'), {}));
            client.add_to_scene(sky.mesh);


            //TODO: move up, up and away
            client.on_element_arrival(client.all('wireframes'), add_wireframe);
            client.on_element_change(client.all('wireframes'), move_wireframe);
            client.on_element_removal(client.all('wireframes'), remove_wireframe);
        };

        var update = function() {
            client.calculate_score(client.value(client.all('invaders')), client.value(client.the('duration')), client.value(client.the('misses')));
            if (client.score_changed) {
                scoreText.update_text(client.score, client.scene);    
            }
        };

        var client = Object.create(OrthographicDisplay(element, width, height, options, setup, update));
        _.extend(client, score);

        return client;
    };
});
