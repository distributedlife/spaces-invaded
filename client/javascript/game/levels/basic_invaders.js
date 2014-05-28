define([
    "socket.io", "zepto", "lodash", "lib/orthographic_display", "lib/config", "lib/sprite", "lib/window", 'lib/audio_emitter', 
    'game/score', 'lib/orthographic_text', 'font/helvetiker_regular', 'lib/particle/rocket_trail'],
  function(io, $, _, OrthographicDisplay, config, sprite, window, audio_emitter, 
    score, orthographic_text, helvetiker_regular, RocketTrail)
  {
    "use strict";

    return function(element, width, height, options) {
        var the_tank = function(state) { return state.tank; };
        var tank_bullet = function(state) {return state.bullet; };
        var an_invader = function(state, i) { return state.invaders[i]; };
        var all_invaders = function(state) { return state.invaders; };
        var an_invader_bullet = function(state, i) { return state.invader_bullets[i]; };
        var all_invader_bullets = function(state, i) { return state.invader_bullets; };

        var screen_width = function(state) { return state.dimensions.width; };
        var the_duration = function(state) { return state.duration; };
        var misses = function(state) { return state.misses; };

        var is_inactive = function(thing) { return thing.active === false; };
        var is_active = function(thing) { return thing.active === true; };

        var tank = null;
        var bullet = null;
        var invader_bullets = {};
        var invaders = {};

        var tank_die = null;
        var tank_bullet_fire = null;

        var scoreText = {};
        var rocket_trail = null;

        var create_death_score = function(invader) {
            var death_score = new orthographic_text(
                //TODO: score based on invader type
                "5", 
                {
                    duration: 0.5, 
                    scale: {from: 1, to: 5},
                    colour: {
                        from: [1.0, 1.0, 1.0, 1.0],
                        to: [1.0, 0.0, 0.0, 0.0]
                    }
                }, 
                {
                    size: 20
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

            if (!model.active && prior_model.active) {
                create_death_score(model);
            }
        };

        var game_over_man = function(model, prior_model) {
            console.log("TODO: implement game over man");
        };

        var setup = function() {
            tank = Object.create(sprite(client.value(the_tank), config.resolve_game_image('tank.png')));
            tank_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_die.mp3'), {}, is_inactive));
            tank_bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_bullet.mp3'), {}, is_active));
            client.add_to_scene(tank.mesh);
            client.on_change(the_tank, when_tank_changes);
            client.on_conditional_change(the_tank, is_inactive, game_over_man);


            bullet = Object.create(sprite(client.value(tank_bullet), config.resolve_game_image('tank_bullet.png')));
            client.add_to_scene(bullet.mesh);
            client.on_change(tank_bullet, when_tank_bullet_changes);


            var scoreDisplayOptions = {
                alignment: { 
                    horizontal: "right", 
                    vertical: "top"
                },
                size: 20
            };
            scoreText = Object.create(orthographic_text(
                client.score, 
                scoreDisplayOptions,  
                //TODO: merge with display options
                { size: 20 }
            ));
            scoreText.update_from_model({x: client.value(screen_width) - 10, y: 0});
            client.add_to_scene(scoreText.mesh);



            _.each(client.value(all_invader_bullets), function(bullet) {
                var bullet_sprite = Object.create(sprite(bullet, config.resolve_game_image('invader_bullet.png')));
                var bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_bullet_fire.wav'), { volume: 40}, is_active));
                var bullet_miss = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_bullet_miss.wav'), { volume: 30}, is_inactive)); 

                invader_bullets[bullet.id] = {
                    sprite: bullet_sprite,
                    audio: {
                        fire: bullet_fire,
                        miss: bullet_miss
                    }
                };

                client.add_to_scene(bullet_sprite.mesh);
            });
            client.on_element_change(all_invader_bullets, an_invader_bullet, when_an_invader_bullet_changes);


            _.each(client.value(all_invaders), function(invader) {
                var invader_sprite = Object.create(sprite(invader, config.resolve_game_image("invader_"+invader.type+".png")));
                var invader_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_die.mp3'), {volume: 25}, is_inactive));

                invaders[invader.id] = {
                    sprite: invader_sprite,
                    audio: {
                        die: invader_die
                    }
                };
                client.add_to_scene(invader_sprite.mesh);
            });
            client.on_element_change(all_invaders, an_invader, when_an_invader_changes);


            var soundtrack = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('soundtrack.mp3'), {volume: 75}));
            soundtrack.play();


            rocket_trail = RocketTrail.make();
            client.add_to_scene(rocket_trail.mesh());
            client.permanent_effects.push(rocket_trail);
        };

        var update = function() {
            client.calculate_score(client.value(all_invaders), client.value(the_duration), client.value(misses));
            if (client.score_changed) {
                scoreText.update_text(client.score, client.scene);    
            }
        };

        var expired_effects_func = function(expired_effects) {
            _.each(expired_effects, function(expired_effect) { 
                client.remove_from_scene(expired_effect.mesh);
            });
        };

        var client = Object.create(OrthographicDisplay(element, width, height, options, setup, update, expired_effects_func));
        _.extend(client, score);

        return client;
    };
});
