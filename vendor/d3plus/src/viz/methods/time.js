(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [Array, Boolean, Function, Object, String],
    dataFilter: true,
    deprecates: ["year", "year_var"],
    fixed: {
      accepted: [Boolean],
      deprecates: ["static_axis", "static_axes"],
      value: true
    },
    format: {
      accepted: [false, Array, Function, String],
      value: false
    },
    mute: filter(false),
    solo: filter(false),
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/time.js.map