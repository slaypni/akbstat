(function() {
  var fetchValue, graph, line, nest, stack;

  fetchValue = require("../../core/fetch/value.coffee");

  graph = require("./helpers/graph/draw.coffee");

  nest = require("./helpers/graph/nest.coffee");

  stack = require("./helpers/graph/stack.coffee");

  line = function(vars) {
    var d, data, domains, i, j, len, len1, point, ref;
    graph(vars, {
      buffer: vars.axes.opposite,
      mouse: true
    });
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return [];
    }
    data = vars.data.viz;
    for (i = 0, len = data.length; i < len; i++) {
      point = data[i];
      ref = point.values;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        d = ref[j];
        d.d3plus.x = vars.x.scale.viz(fetchValue(vars, d, vars.x.value));
        d.d3plus.x += vars.axes.margin.left;
        d.d3plus.y = vars.y.scale.viz(fetchValue(vars, d, vars.y.value));
        d.d3plus.y += vars.axes.margin.top;
      }
    }
    if (vars.axes.stacked) {
      return stack(vars, data);
    } else {
      return data;
    }
  };

  line.filter = function(vars, data) {
    return nest(vars, data);
  };

  line.requirements = ["data", "x", "y"];

  line.setup = function(vars) {
    var axis, size, y;
    if (!vars.axes.discrete) {
      axis = vars.time.value === vars.y.value ? "y" : "x";
      vars.self[axis]({
        scale: "discrete"
      });
    }
    y = vars[vars.axes.opposite];
    size = vars.size;
    if ((!y.value && size.value) || (size.changed && size.previous === y.value)) {
      vars.self[vars.axes.opposite](size.value);
    } else if ((!size.value && y.value) || (y.changed && y.previous === size.value)) {
      vars.self.size(y.value);
    }
  };

  line.shapes = ["line"];

  line.tooltip = "static";

  module.exports = line;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/line.js.map