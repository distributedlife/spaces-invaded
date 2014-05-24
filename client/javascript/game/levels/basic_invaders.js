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

        var the_width = function(state) { return state.dimensions.width; };
        var the_duration = function(state) { return state.duration; };
        var misses = function(state) { return state.misses; };

        var tank = null;
        var bullet = null;
        var invader_bullets = {};
        var invaders = {};
        var scoreText = {};

        var tank_die = null;
        var tank_bullet_fire = null;

        var is_inactive = function(thing) { return thing.active === false; };
        var is_active = function(thing) { return thing.active === true; };

        var rocket_trail = null;

        var client = Object.create(OrthographicDisplay(element, width, height, options));
        _.extend(client, score);
        _.extend(client, {
            setup_game: function() {
                if (tank !== null) { client.remove_from_scene(tank.mesh); }
                if (bullet !== null) { client.remove_from_scene(bullet.mesh); }
                if (scoreText !== null) { client.remove_from_scene(scoreText.mesh); }
                _.each(invader_bullets, function(bullet) {
                    if (bullet !== null) { client.remove_from_scene(bullet.sprite.mesh); }
                });
                _.each(invaders, function(invader) {
                    if (invader !== null) { client.remove_from_scene(invader.sprite.mesh); }
                });

                tank = Object.create(sprite(client.value(the_tank), config.resolve_game_image('tank.png')));
                bullet = Object.create(sprite(client.value(tank_bullet), config.resolve_game_image('tank_bullet.png')));
                client.add_to_scene(tank.mesh, bullet.mesh);

                scoreText = Object.create(orthographic_text(client.score, "right", "top", {size: 20 }));
                scoreText.update_from_model({x: client.value(the_width) - 10, y: 0});
                client.add_to_scene(scoreText.mesh);

                tank_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_die.mp3'), {}, is_inactive));
                tank_bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_bullet.mp3'), {}, is_active));

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

                // var soundtrack = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('soundtrack.mp3'), {volume: 75}));
                // soundtrack.play();

                rocket_trail = RocketTrail.make();
                client.add_to_scene(rocket_trail.mesh());
            },
            update_game: function() {
                if (client.changed(the_tank)) { 
                    tank.update_from_model(client.value(the_tank));
                    tank_die.update_from_model(client.value(the_tank));
                }
                if (client.changed(tank_bullet)) { 
                    bullet.update_from_model(client.value(tank_bullet)); 
                    tank_bullet_fire.update_from_model(client.value(tank_bullet));
                    rocket_trail.update_from_model(client.value(tank_bullet));
                }

                var counter = 0;
                _.each(client.value(all_invader_bullets), function(bullet) {
                    if (client.element_changed(an_invader_bullet, counter)) {
                        invader_bullets[bullet.id].sprite.update_from_model(bullet);
                        invader_bullets[bullet.id].audio.fire.update_from_model(bullet);
                        invader_bullets[bullet.id].audio.miss.update_from_model(bullet);
                    }
                    counter++;
                }); 

                counter = 0;
                _.each(client.value(all_invaders), function(invader) {
                    if (client.element_changed(an_invader, counter)) {
                        invaders[invader.id].sprite.update_from_model(invader);
                        invaders[invader.id].audio.die.update_from_model(invader);
                    }
                    counter++;
                }); 

                if (client.value(the_tank).active === false) {
                    //TODO: implement game over man
                }

                client.calculate_score(client.value(all_invaders), client.value(the_duration), client.value(misses));
                if (client.score_changed) {
                    scoreText.update_text(client.score, client.scene);    
                }
            },

            tick_display: function(dt) {
                rocket_trail.tick(dt);
            }
        });

        return client;
    };
});
