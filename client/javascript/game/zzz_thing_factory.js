define(["game/bullet_view", "game/tank_view", "game/enums"],
  function(BulletView, TankView, enums)
  {
  "use strict";

    return function() {
      this.make_bullet = function(sound_manager) {
        return Object.create(Bullet);
        var bullet = {};
        bullet.model = new Bullet();
        bullet.view = new BulletView(bullet.model);
        // bullet.audio_emitter = new BulletAudioEmitter(bullet.model, sound_manager);

        return bullet;
      };



      //TODO: can we get the sound manager to come in via module bindings?
      // this.make_tank = function(bullet, sound_manager) {
      this.make_tank = function(bullet) {
        // var tank = {};
        // tank.model = new Tank(bullet);
        // tank.view = new TankView(tank.model);
        // tank.audio_emitter = new TankAudioEmitter(tank.model, sound_manager);
        // return tank;


        //No TankAudioEmitter, BulletAudioEmitter, InvaderBulletAudioEmitter
        //No TankView, BulletView, InvaderView, InvaderBulletView
        //No Resource
        // var tank_model = {};
        // tank_view = {};
        // tank_audio = {};

        var tank = Object.create(Tank(bullet));
        return tank;
        // return new Tank(bullet);
        // return tank_model;
        // Engine.update_every_frame(tank_model);
        
        // tank_audio = AudioEmitter();
        // tank_audio.bind_to_model(tank_model, { 
        //   'die': config.audio_path('tank_die.mp3') 
        // });

        // function (model, eventAudio) {
        //   for (var event_name in eventAudio) {
        //     if (eventAudio.hasOwnProperty(event_name)) {
        //       model.on_event(event_name, _this[eventAudio[event_name]])
        //     }
        //   }
        // }

        // tank_view = Sprite(config.image_path('tank.png'));
        // tank_view.bind_to_model(tank_model, {
        //   'spawn': 'show', 
        //   'spawn': 'position', 
        //   'update': 'position', 
        //   //rename 'update_position' to 'position'
        //   'die': 'hide'
        // }); 

        // function (model, sprite, eventFuncs) {
        //   for (var event_name in eventFuncs) {
        //     if (eventFuncs.hasOwnProperty(event_name)) {
        //       model.on_event(event_name, _this[eventFuncs[event_name]])
        //     }
        //   }
        // }




      };

      // this.make_bug_invader = function(invader_bullet, sound_manager) {
      //   return make_invader(invader_bullet, sound_manager, enums.InvaderTypes.Bug);
      // };

      // this.make_skull_invader = function(invader_bullet, sound_manager) {
      //   return make_invader(invader_bullet, sound_manager, enums.InvaderTypes.Skull);
      // };

      // this.make_squid_invader = function(invader_bullet, sound_manager) {
      //   return make_invader(invader_bullet, sound_manager, enums.InvaderTypes.Squid);
      // };

      // var make_invader = function(invader_bullet, sound_manager, type) {
      //   var invader = {};
      //   invader.model = new Invader(invader_bullet, type);
      //   invader.view = new InvaderView(invader.model);
      //   invader.audio_emitter = new InvaderAudioEmitter(invader.model, sound_manager);

      //   return invader;
      // };

      // this.make_invader_bullet = function(sound_manager) {
      //   var invader_bullet = {};
      //   invader_bullet.model = new InvaderBullet();
      //   invader_bullet.view = new InvaderBulletView(invader_bullet.model);
      //   invader_bullet.audio_emitter = new InvaderBulletAudioEmitter(invader_bullet.model, sound_manager);

      //   return invader_bullet;
      // };

      // this.make_swarm = function(invaders, config) {
      //   var swarm = {};
      //   swarm.model = new Swarm(invaders, config);

      //   return swarm;
      // };
    };
});
