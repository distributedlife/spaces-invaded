//SM2_DEFER must be true to stop soundmanager trying to load ALL THE THINGS at start up.
//We need to setup some variables here (rather than inside the html). However SM2_DEFER
//requires the window object, which if we're running node then it's global. Anyway
//this does all that
window = (typeof window === 'undefined') ? global : window;
window.SM2_DEFER = true;

define(['ext/soundmanager2-nodebug-jsmin', 'lib/config'], function (unused, config) {
  "use strict";

  return function() {
    var soundmanager = new SoundManager();
    soundmanager.url = config.swf_path;
    soundmanager.flashVersion = 9;
    soundmanager.debugMode = false;
    soundmanager.debugFlash = false;
    soundmanager.preferFlash = false;
    soundmanager.useHTML5Audio = true;
    soundmanager.HTML5Only = true;
    soundmanager.beginDelayedInit();

    soundmanager.ontimeout = function() {
      // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
    };

    // soundmanager.volume = function(options) {
      // options.volume = options.volume * config.global_volume;
    // };

    soundmanager.disable_sound = function() {
      soundmanager.mute();
      soundmanager.volume(0);
    };

    soundmanager.enable_sound = function() {
      soundmanager.unmute();
      soundmanager.volume(100);
    }

    return soundmanager;
  };
});
