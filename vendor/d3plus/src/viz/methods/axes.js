(function() {
  var rendering;

  rendering = require("../../core/methods/rendering.coffee");

  module.exports = {
    background: {
      color: "#fafafa",
      rendering: rendering(),
      stroke: {
        color: "#ccc",
        width: 1
      }
    },
    mirror: {
      accepted: [Boolean],
      deprecates: ["mirror_axis", "mirror_axes"],
      value: false
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/axes.js.map