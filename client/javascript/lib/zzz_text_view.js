define(["lib/window", "ext/zepto.min"], function(window, $) {
  "use strict";

  return function(id) {
    var _this = this;

    _this.init = function() {
      _this.text = window.get_element_by_id(id);
    };

    _this.show = function() {
      $(_this.text).show();
    };

    _this.hide = function() {
      $(_this.text).hide();
    };

    _this.update_text = function(text) {
      _this.text.innerHTML = text;
    };

    _this.add_class = function(classname) {
      $("#" + id).addClass(classname);
    };

    _this.remove_class = function(classname) {
      $("#" + id).removeClass(classname);
    };

    _this.init();
    return _this;
  };
});
