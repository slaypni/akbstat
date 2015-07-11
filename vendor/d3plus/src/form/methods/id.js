(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [Array, String],
    dataFilter: true,
    mute: filter(true),
    nesting: ["value"],
    solo: filter(true),
    value: "value"
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/id.js.map