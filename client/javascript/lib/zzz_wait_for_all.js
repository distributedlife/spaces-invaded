define([], function() {
  "use strict";

  return function(method, clients, event_to_wait_on, on_complete) {
    var wait_for_all = this;

    var init = function() {
      wait_for_all.m = method;
      wait_for_all.completed = 0;

      clients.forEach(function(client) {
        client.on_event(event_to_wait_on, complete);
      });
    };

    wait_for_all.start = function() {
      wait_for_all.completed = 0;

      var params = [].splice.call(arguments, 0);
      clients.forEach(function(client) {
        client[method].apply(null, params);
      });
    };

    var complete = function() {
      wait_for_all.completed += 1;

      if (wait_for_all.completed === clients.length) {
        on_complete();
      }
    };

    init();
    return wait_for_all;
  };
});
