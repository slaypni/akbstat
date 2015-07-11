(function() {
  var rendering;

  rendering = require("../../core/methods/rendering.coffee");

  module.exports = {
    accepted: function(vars) {
      var list;
      list = vars.types[vars.type.value].shapes;
      if (list && !(list instanceof Array)) {
        list = [list];
      }
      if (list.length) {
        return list;
      } else {
        return ["square"];
      }
    },
    interpolate: {
      accepted: ["basis", "basis-open", "cardinal", "cardinal-open", "linear", "monotone", "step", "step-before", "step-after"],
      deprecates: "stack_type",
      value: "linear"
    },
    rendering: rendering(),
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/shape.js.map