define(function() {
  return function() {
    var _this = this;

    _this.Directions = {
      Left: -1,
      Right: 1,
      Reverse: -1
    };

    _this.InvaderTypes = {
      Bug: "Bug",
      Squid: "Squid",
      Skull: "Skull"
    };

    return _this;
  }();
});
