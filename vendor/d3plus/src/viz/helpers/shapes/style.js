(function() {
  var color, ie;

  color = require("./color.coffee");

  ie = require("../../../client/ie.js");

  module.exports = function(nodes, vars) {
    return nodes.attr("fill", function(d) {
      if (d.d3plus && d.d3plus.spline) {
        return "none";
      } else {
        return color(d, vars);
      }
    }).style("stroke", function(d) {
      var c;
      if (d.d3plus && d.d3plus.stroke) {
        return d.d3plus.stroke;
      } else {
        c = d.values ? color(d.values[0], vars) : color(d, vars, true);
        return d3.rgb(c).darker(0.6);
      }
    }).style("stroke-width", function(d) {
      var mod;
      if (ie && vars.types[vars.type.value].zoom) {
        return 0;
      }
      mod = d.d3plus.shape === "line" ? 2 : 1;
      return vars.data.stroke.width * mod;
    }).attr("opacity", vars.data.opacity).attr("vector-effect", "non-scaling-stroke");
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/style.js.map