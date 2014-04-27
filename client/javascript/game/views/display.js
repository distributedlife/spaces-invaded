define(["socket.io", "events", "lib/orthographic_display", "lib/config", "lib/sprite", "lib/window", "zepto", "lib/sound_manager2", "lodash"],
  function(io, Events, OrthographicDisplay, config, sprite, window, $, SoundManager, _)
  {
    "use strict";

    return function(element, width, height, options) {
        var client = Object.create(OrthographicDisplay(element, width, height, options));
        var sound_manager = new SoundManager();

        var the_tank = function(state) { return state.tank; };
        var tank_bullet = function(state) {return state.bullet; };
        var an_invader = function(state, i) { return state.invaders[i]; };
        var all_invaders = function(state) { return state.invaders; };
        var an_invader_bullet = function(state, i) { return state.invader_bullets[i]; };
        var all_invader_bullets = function(state, i) { return state.invader_bullets; };

        var tank = null;
        var bullet = null;
        var invader_bullets = [];
        var invaders = [];

        client.setup_game = function() {
            console.log(client.current_state.invaders[0]);
            console.log(client.current_state.invaders[0].type);
            tank = Object.create(sprite(client.value(the_tank), config.resolve_image('tank.png')));
            bullet = Object.create(sprite(client.value(tank_bullet), config.resolve_image('tank_bullet.png'))); 
            client.add_to_scene(tank.mesh, bullet.mesh);

            _.each(client.value(all_invader_bullets), function(bullet) {
                var bullet_sprite = Object.create(sprite(bullet, config.resolve_image('invader_bullet.png')));

                invader_bullets.push(bullet_sprite);
                client.add_to_scene(bullet_sprite.mesh);
            });

            _.each(client.value(all_invaders), function(invader) {
                var invader_sprite = Object.create(sprite(invader, config.resolve_image("invader_"+invader.type+".png")));

                invaders.push(invader_sprite);
                client.add_to_scene(invader_sprite.mesh);
            });
        };

        client.update_game = function() {
            if (client.changed(the_tank).active === false) {
                //TODO: implement game over man
            }

            if (client.changed(the_tank)) { 
                tank.update_from_model(client.value(the_tank));
            }
            if (client.changed(tank_bullet)) { 
                bullet.update_from_model(client.value(tank_bullet)); 
            }

            var counter = 0;
            _.each(client.value(all_invader_bullets), function(bullet) {
                if (client.element_changed(an_invader_bullet, counter)) {
                    invader_bullets[counter].update_from_model(bullet);
                }
                counter++;
            }); 

            counter = 0;
            _.each(client.value(all_invaders), function(invader) {
                if (client.element_changed(an_invader, counter)) {
                    invaders[counter].update_from_model(invader);
                }
                counter++;
            }); 
        };

        return client;
    };
});
