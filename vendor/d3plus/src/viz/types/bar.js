(function() {
  var bar, fetchValue, graph, nest, stack, uniques,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fetchValue = require("../../core/fetch/value.coffee");

  graph = require("./helpers/graph/draw.coffee");

  nest = require("./helpers/graph/nest.coffee");

  stack = require("./helpers/graph/stack.coffee");

  uniques = require("../../util/uniques.coffee");

  bar = function(vars) {
    var bars, base, cMargin, d, data, discrete, discreteVal, divisions, domains, h, i, j, k, len, len1, length, maxSize, mod, nested, oMargin, offset, oppVal, opposite, padding, point, ref, ref1, space, value, w, x, zero;
    discrete = vars.axes.discrete;
    h = discrete === "x" ? "height" : "width";
    w = discrete === "x" ? "width" : "height";
    opposite = vars.axes.opposite;
    cMargin = discrete === "x" ? "left" : "top";
    oMargin = discrete === "x" ? "top" : "left";
    graph(vars, {
      buffer: true,
      zero: vars.axes.opposite
    });
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return [];
    }
    nested = vars.data.viz;
    if (vars.axes.stacked) {
      stack(vars, nested);
    }
    space = vars.axes[w] / vars[vars.axes.discrete].ticks.values.length;
    padding = vars[vars.axes.discrete].padding.value;
    if (padding < 1) {
      padding *= space;
    }
    if (padding * 2 > space) {
      padding = space * 0.1;
    }
    maxSize = space - padding * 2;
    if (!vars.axes.stacked) {
      if (ref = vars[discrete].value, indexOf.call(vars.id.nesting, ref) >= 0) {
        bars = d3.nest().key(function(d) {
          return fetchValue(vars, d, vars[discrete].value);
        }).entries(nested);
        divisions = d3.max(bars, function(b) {
          return b.values.length;
        });
      } else {
        bars = uniques(nested, vars.id.value, fetchValue, vars);
        divisions = bars.length;
      }
      maxSize /= divisions;
      offset = space / 2 - maxSize / 2 - padding;
      x = d3.scale.linear().domain([0, divisions - 1]).range([-offset, offset]);
    }
    data = [];
    zero = 0;
    for (i = j = 0, len = nested.length; j < len; i = ++j) {
      point = nested[i];
      mod = vars.axes.stacked ? 0 : x(i % divisions);
      ref1 = point.values;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        d = ref1[k];
        if (vars.axes.stacked) {
          value = d.d3plus[opposite];
          base = d.d3plus[opposite + "0"];
        } else {
          oppVal = fetchValue(vars, d, vars[opposite].value);
          if (oppVal === 0) {
            continue;
          }
          if (vars[opposite].scale.value === "log") {
            zero = oppVal < 0 ? -1 : 1;
          }
          value = vars[opposite].scale.viz(oppVal);
          base = vars[opposite].scale.viz(zero);
        }
        discreteVal = fetchValue(vars, d, vars[discrete].value);
        d.d3plus[discrete] = vars[discrete].scale.viz(discreteVal);
        d.d3plus[discrete] += vars.axes.margin[cMargin] + mod;
        length = base - value;
        d.d3plus[opposite] = base - length / 2;
        if (!vars.axes.stacked) {
          d.d3plus[opposite] += vars.axes.margin[oMargin];
        }
        d.d3plus[w] = maxSize;
        d.d3plus[h] = Math.abs(length);
        d.d3plus.init = {};
        d.d3plus.init[opposite] = vars[opposite].scale.viz(zero);
        d.d3plus.init[opposite] -= d.d3plus[opposite];
        d.d3plus.init[opposite] += vars.axes.margin[oMargin];
        d.d3plus.init[w] = d.d3plus[w];
        d.d3plus.label = false;
        data.push(d);
      }
    }
    return data;
  };

  bar.filter = function(vars, data) {
    return nest(vars, data);
  };

  bar.requirements = ["data", "x", "y"];

  bar.setup = function(vars) {
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
      return vars.self[vars.axes.opposite](size.value);
    } else if ((!size.value && y.value) || (y.changed && y.previous === size.value)) {
      return vars.self.size(y.value);
    }
  };

  bar.shapes = ["square"];

  module.exports = bar;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/bar.js.map