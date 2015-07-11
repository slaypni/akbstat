(function() {
  module.exports = function(data, vars) {
    var depth, max_depth, nextDepth;
    max_depth = vars.id.nesting.length - 1;
    depth = vars.depth.value;
    nextDepth = vars.id.nesting[vars.depth.value + 1];
    if (vars.types[vars.type.value].nesting === false) {
      return 0;
    } else if ((data.d3plus.merged || (nextDepth in data && depth < max_depth)) && (!data || nextDepth in data)) {
      return 1;
    } else if ((depth === max_depth || (data && (!(nextDepth in data)))) && (vars.small || !vars.tooltip.html.value)) {
      return -1;
    } else {
      return 0;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/zoom/direction.js.map