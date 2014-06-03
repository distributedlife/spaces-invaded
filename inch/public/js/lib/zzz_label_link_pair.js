define(["lib/window", "lib/text_view", "lib/interactive_text_view"], function(Window, TextView, InteractiveTextView) {
  "use strict";

  return function(root, name, i) {
    var _this = this;

    _this.init = function() {
      var card_root = _this.create_card_root();
      $(root).append(card_root);
      $(card_root).append(_this.create_card_display(i));
      $(card_root).append(_this.create_card_link(i));

      _this.label = new TextView("slot" + i + name);
      _this.link = new InteractiveTextView("slot" + i + name + "link");
    };

    _this.create_card_root = function() {
      return Window.create_element('div');
    };

    _this.create_card_display = function() {
      var display = Window.create_element('span');
      display.id = "slot" + i + name;

      return display;
    };

    _this.create_card_link = function() {
      var link = Window.create_element('a');
      link.id = "slot" + i + name + "link";
      link.href = "#";

      return link;
    };

    _this.show = function(show_links) {
      _this.label.show();

      if (show_links) {
        _this.link.show();
      }
    };

    _this.hide = function() {
      _this.label.hide();
      _this.link.hide();
    };

    _this.update_text = function(label, link) {
      _this.label.update_text(label);
      _this.link.update_text(link);
    };

    _this.init();
    return _this;
  };
});
