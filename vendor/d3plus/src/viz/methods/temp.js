(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [false, Function, Object, String],
    deprecates: ["else_var", "else"],
    mute: filter(true),
    solo: filter(true),
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/temp.js.map