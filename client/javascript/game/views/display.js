define(["socket.io", "events", "lib/orthographic_display", "lib/config", "lib/sprite", "lib/window", "zepto", "lib/sound_manager2", "underscore", "lib/controller"],
  function(io, Events, OrthographicDisplay, config, sprite, window, $, SoundManager, _, Controller)
  {
    "use strict";

    return function(element, width, height) {
        var d = Object.create(OrthographicDisplay(width, height));
        var sound_manager = new SoundManager();

        //TODO: move these to some common parent
        var pause = function() { $('.paused').show(); }
        var resume = function() { $('.paused').hide(); }

        var get_tank = function() { return d.state.tank; }
        var get_bullet = function() { return d.state.bullet; }

        var init = function(width, height) {
            var socket = io.connect('/desktop');

            socket.emit('resize', {
                width: width,
                height: height
            });

            var tank = null;
            var bullet = null;

            socket.on('game_state/setup', function(game_state) {
                d.state = game_state

                tank = Object.create(sprite(get_tank(), config.resolve_image('tank.png')));
                bullet = Object.create(sprite(get_bullet(), config.resolve_image('tank_bullet.png'))); 
                
                d.add_to_scene(tank.mesh, bullet.mesh);
            });

            socket.on('game_state/update', function(game_state) {
                d.state = game_state

                tank.update_from_model(get_tank());
                bullet.update_from_model(get_bullet());

                if (get_tank().active = false) {
                    //TODO: implement game over man
                }

                if (d.state.paused) { pause(); }
                if (!d.state.paused) { resume(); }
            });

            Controller(socket, element, width, height);
                 
        // AudioEmitter(tank, bindings);
        // var invaders = [];
        // var i = 0;
        // var invader_bullet, invader;
        // for(i = 0; i < 10; ++i) {
        //   invader_bullet = thing_factory.make_invader_bullet(sound_manager);
        //   invader = thing_factory.make_squid_invader(invader_bullet.model, sound_manager);
        //   invaders.push(invader.model);
        //   d.add_to_scene_and_things(invader_bullet.model, invader_bullet.view);
        //   d.add_to_scene_and_things(invader.model, invader.view);
        // }
        // for(i = 0; i < 20; ++i) {
        //   invader_bullet = thing_factory.make_invader_bullet(sound_manager);
        //   invader = thing_factory.make_bug_invader(invader_bullet.model, sound_manager);
        //   invaders.push(invader.model);
        //   d.add_to_scene_and_things(invader_bullet.model, invader_bullet.view);
        //   d.add_to_scene_and_things(invader.model, invader.view);
        // }
        // for(i = 0; i < 20; ++i) {
        //   invader_bullet = thing_factory.make_invader_bullet(sound_manager);
        //   invader = thing_factory.make_skull_invader(invader_bullet.model, sound_manager);
        //   invaders.push(invader.model);
        //   d.add_to_scene_and_things(invader_bullet.model, invader_bullet.view);
        //   d.add_to_scene_and_things(invader.model, invader.view);
        // }

        // var swarm_config = {
        //   cols: 10,
        //   row_pad: 40,
        //   row_margin: 24,
        //   col_pad: 60,
        //   col_margin: 33,
        //   left_extent: 0,
        //   right_extent: width,
        //   direction: 1
        // };

        // var swarm = thing_factory.make_swarm(invaders, swarm_config);
        // swarm.model.on_event('die', d.level_completed);
        // d.things.push(swarm.model);


        // var soundtrack = new AudioEmitter(sound_manager, 'soundtrack', config.audio_path + 'soundtrack.mp3');
        // soundtrack.volume = 30;
        // soundtrack.play();

        };

        init(width, height);

        return d;
    };
});
