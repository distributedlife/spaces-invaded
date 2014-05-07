define(function() {
  return {
    image_path: "/client/img/",
    audio_path: "/client/audio/",
    swf_path: "/client/swf/",

    global_volume: 0.0,
    music_enabled: true,
    sound_enabled: true,
    wireframe: false,

    grid: {
      enabled: false,
      size: 50,
      colour: 0x00FF00
    },

    resolve_image: function(filename) {
      return this.image_path + filename;
    },
    resolve_audio: function(filename) {
      return this.audio_path + filename;
    },
    resolve_swf: function(filename) {
      return this.swf_path + filename;
    }
  };
});
