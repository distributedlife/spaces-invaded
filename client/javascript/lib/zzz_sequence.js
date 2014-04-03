define([], function() {
  "use strict";

  return function() {
    var _this = this;

    _this.stages = [];
    _this.stage = 0;

    _this.play = function() {
      var stage_complete = _this.stages[_this.stage]();
      if (stage_complete) {
        _this.stage += 1;
      }
    };

    _this.is_complete = function() {
      return (_this.stage === _this.stages.length);
    };

    return _this;
  };
});
