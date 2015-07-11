(function() {
  var chart, print;

  print = require("../../../core/console/print.coffee");

  chart = function(vars) {
    var type, types;
    types = {
      circle: "scatter",
      donut: "scatter",
      line: "line",
      square: "scatter",
      area: "stacked"
    };
    type = types[vars.shape.value];
    print.warning("The \"chart\" visualization type has been deprecated and will be removed in version 2.0. Please use the \"" + type + "\" visualization type.");
    vars.self.type(type).draw();
  };

  chart.shapes = ["circle", "donut", "line", "square", "area"];

  module.exports = chart;

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/deprecated/chart.js.map