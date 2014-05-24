define(function() {
  return {
    lib_image_path: "/client/img/lib/",
    game_image_path: "/client/img/game/",
    audio_path: "/client/audio/game/",
    swf_path: "/client/swf/",

    global_volume: 0.0,
    wireframe: false,

    grid: {
      enabled: false,
      size: 50,
      colour: 0x00FF00
    },

    resolve_lib_image: function(filename) {
      return this.lib_image_path + filename;
    },
    resolve_game_image: function(filename) {
      return this.game_image_path + filename;
    },
    resolve_audio: function(filename) {
      return this.audio_path + filename;
    },
    resolve_swf: function(filename) {
      return this.swf_path + filename;
    }
  };
});
