(function() {
  var fetchColor, fetchValue, lighter, segments;

  fetchValue = require("../../../core/fetch/value.coffee");

  fetchColor = require("../../../core/fetch/color.coffee");

  lighter = require("../../../color/lighter.coffee");

  segments = require("./segments.coffee");

  module.exports = function(d, vars, stroke) {
    var active, shape, temp, total;
    shape = d.d3plus.shape || vars.shape.value;
    if (vars.shape.value === "line" && shape !== "circle") {
      return "none";
    } else if (vars.shape.value === "area" || shape === "active" || vars.shape.value === "line") {
      return fetchColor(vars, d);
    } else if (shape === "temp") {
      if (stroke) {
        return fetchColor(vars, d);
      } else {
        return "url(#d3plus_hatch_" + d.d3plus.id + ")";
      }
    } else if (d.d3plus["static"]) {
      return lighter(fetchColor(vars, d), .75);
    }
    active = segments(vars, d, "active");
    temp = segments(vars, d, "temp");
    total = segments(vars, d, "total");
    if ((!vars.active.value && !vars.temp.value) || active === true || (active && total && active >= total && !temp) || (active && !total)) {
      return fetchColor(vars, d);
    } else if (vars.active.spotlight.value) {
      return "#eee";
    } else {
      return lighter(fetchColor(vars, d), .75);
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/color.js.map