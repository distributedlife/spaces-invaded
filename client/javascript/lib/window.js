define(["ext/window"], function (window) {
  return function() {
    var _this = this;

    _this.load_page = function(url) {
      window.parent.location.href = url;
    };

    _this.get_element_by_id = function(id) {
      return window.document.getElementById(id);
    };

    _this.create_element = function(element) {
      return window.document.createElement(element);
    };

    _this.request_animation_frame = function(f) {
      return window.requestAnimationFrame(f);
    };

    return _this;
  }();
});
