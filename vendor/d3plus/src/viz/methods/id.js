(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [Array, String],
    dataFilter: true,
    deprecates: ["id_var", "nesting"],
    grouping: {
      accepted: [Boolean],
      value: true
    },
    mute: filter(true),
    nesting: ["id"],
    solo: filter(true),
    value: "id"
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/id.js.map