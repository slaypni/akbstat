(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [false, Function, Object, String],
    deprecates: "active_var",
    mute: filter(true),
    solo: filter(true),
    spotlight: {
      accepted: [Boolean],
      deprecates: "spotlight",
      value: false
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/active.js.map