(function() {
  module.exports = function(elem, vars) {
    var legible, lighter, textColor;
    legible = require("../../../../color/legible.coffee");
    lighter = require("../../../../color/lighter.coffee");
    textColor = require("../../../../color/text.coffee");
    return elem.style("background-color", function(d) {
      var color;
      if (vars.focus.value === d[vars.id.value]) {
        color = vars.ui.color.secondary.value;
      } else {
        color = vars.ui.color.primary.value;
      }
      if (vars.hover.value === d[vars.id.value]) {
        color = d3.rgb(color).darker(0.15).toString();
      }
      return color;
    }).style("color", function(d) {
      var color, image, opacity;
      if (vars.focus.value === d[vars.id.value]) {
        opacity = 0.75;
      } else {
        opacity = 1;
      }
      image = d[vars.icon.value] && vars.data.viz.length < vars.data.large;
      if (!image && d[vars.color.value]) {
        color = legible(d[vars.color.value]);
      } else {
        color = textColor(d3.select(this).style("background-color"));
      }
      color = d3.rgb(color);
      return "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")";
    }).style('border-color', vars.ui.color.secondary.value);
  };

}).call(this);

//# sourceMappingURL=../../../../../../../_sourcemaps/vendor/d3plus/src/form/types/button/functions/color.js.map