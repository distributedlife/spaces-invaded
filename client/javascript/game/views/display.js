define(["socket.io", "events", "lib/orthographic_display", "lib/config", "lib/sprite", "lib/window", "zepto", "lodash", 'lib/audio_emitter'],
  function(io, Events, OrthographicDisplay, config, sprite, window, $, _, audio_emitter)
  {
    "use strict";

    return function(element, width, height, options) {
        //TODO: mixin
        var client = Object.create(OrthographicDisplay(element, width, height, options));

        var the_tank = function(state) { return state.tank; };
        var tank_bullet = function(state) {return state.bullet; };
        var an_invader = function(state, i) { return state.invaders[i]; };
        var all_invaders = function(state) { return state.invaders; };
        var an_invader_bullet = function(state, i) { return state.invader_bullets[i]; };
        var all_invader_bullets = function(state, i) { return state.invader_bullets; };

        var tank = null;
        var bullet = null;
        var invader_bullets = {};
        var invaders = {};

        var tank_die = null;
        var tank_bullet_fire = null;

        var is_inactive = function(state) { return state.active === false; };
        var is_active = function(state) { return state.active === true; };

        client.setup_game = function() {
            tank = Object.create(sprite(client.value(the_tank), config.resolve_image('tank.png')));
            bullet = Object.create(sprite(client.value(tank_bullet), config.resolve_image('tank_bullet.png')));
            client.add_to_scene(tank.mesh, bullet.mesh);

            tank_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_die.mp3'), {}, is_inactive));
            tank_bullet_fire = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('tank_bullet.mp3'), {}, is_active));

            _.each(client.value(all_invader_bullets), function(bullet) {
                var bullet_sprite = Object.create(sprite(bullet, config.resolve_image('invader_bullet.png')));
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
                var invader_sprite = Object.create(sprite(invader, config.resolve_image("invader_"+invader.type+".png")));
                var invader_die = Object.create(audio_emitter(client.sound_manager, config.resolve_audio('invader_die.mp3'), {volume: 25}, is_inactive));

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
        };

        client.update_game = function() {
            if (client.changed(the_tank)) { 
                tank.update_from_model(client.value(the_tank));
                tank_die.update_from_model(client.value(the_tank));
            }
            if (client.changed(tank_bullet)) { 
                bullet.update_from_model(client.value(tank_bullet)); 
                tank_bullet_fire.update_from_model(client.value(tank_bullet));
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
        };

        return client;
    };
});
