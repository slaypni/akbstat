(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [Array, Boolean, Function, Object, String],
    deprecates: ["name_array", "text_var"],
    nesting: true,
    mute: filter(true),
    solo: filter(true),
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/text.js.map