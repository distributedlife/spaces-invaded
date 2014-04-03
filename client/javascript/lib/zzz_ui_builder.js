define(['lib/text_ui', 'lib/interactive_text_ui', 'lib/label_link_pair'], function(Text, InteractiveText, LabelLinkPair) {
  "use strict";

  return function() {
    var ui_builder = this;

    ui_builder.build_label = function(id) {
      return new Text(id);
    };

    ui_builder.build_control = function(id) {
      return new InteractiveText(id);
    };

    ui_builder.build_link_label_pair = function(root, name, i) {
      return new LabelLinkPair(root, name, i);
    }

    return ui_builder;
  };
});
