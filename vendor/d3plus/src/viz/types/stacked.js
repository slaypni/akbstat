(function() {
  var closest, fetchValue, graph, nest, sort, stack, stacked, threshold;

  closest = require("../../util/closest.coffee");

  fetchValue = require("../../core/fetch/value.coffee");

  graph = require("./helpers/graph/draw.coffee");

  nest = require("./helpers/graph/nest.coffee");

  sort = require("../../array/sort.coffee");

  stack = require("./helpers/graph/stack.coffee");

  threshold = require("../../core/data/threshold.js");

  stacked = function(vars) {
    var d, data, discrete, domains, i, j, len, len1, opposite, point, ref;
    graph(vars, {
      buffer: vars.axes.opposite
    });
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return [];
    }
    data = sort(vars.data.viz, null, null, null, vars);
    discrete = vars[vars.axes.discrete];
    opposite = vars[vars.axes.opposite];
    for (i = 0, len = data.length; i < len; i++) {
      point = data[i];
      if (!point.d3plus) {
        point.d3plus = {};
      }
      ref = point.values;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        d = ref[j];
        if (!d.d3plus) {
          d.d3plus = {};
        }
        d.d3plus.x = discrete.scale.viz(fetchValue(vars, d, discrete.value));
        d.d3plus.x += vars.axes.margin.left;
        d.d3plus.y = opposite.scale.viz(fetchValue(vars, d, opposite.value));
        d.d3plus.y += vars.axes.margin.top;
        if (d.d3plus.merged instanceof Array) {
          if (!point.d3plus.merged) {
            point.d3plus.merged = [];
          }
          point.d3plus.merged = point.d3plus.merged.concat(d.d3plus.merged);
        }
        if (d.d3plus.text && !point.d3plus.text) {
          point.d3plus.text = d.d3plus.text;
        }
      }
    }
    return stack(vars, data);
  };

  stacked.filter = function(vars, data) {
    return nest(vars, threshold(vars, data, vars[vars.axes.discrete].value));
  };

  stacked.requirements = ["data", "x", "y"];

  stacked.setup = function(vars) {
    var axis, size, y;
    if (!vars.axes.discrete) {
      axis = vars.time.value === vars.y.value ? "y" : "x";
      vars.self[axis]({
        scale: "discrete"
      });
    }
    if (!vars[vars.axes.discrete].zerofill.value) {
      vars.self[vars.axes.discrete]({
        zerofill: true
      });
    }
    if (!vars[vars.axes.opposite].stacked.value) {
      vars.self[vars.axes.opposite]({
        stacked: true
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

  stacked.shapes = ["area"];

  stacked.threshold = function(vars) {
    return 20 / vars.height.viz;
  };

  stacked.tooltip = "static";

  module.exports = stacked;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/stacked.js.map