(function() {
  var box, fetchValue, graph, strip, uniques;

  fetchValue = require("../../core/fetch/value.coffee");

  graph = require("./helpers/graph/draw.coffee");

  strip = require("../../string/strip.js");

  uniques = require("../../util/uniques.coffee");

  box = function(vars) {
    var disMargin, discrete, domains, h, medians, mergeData, mode, noData, oppMargin, opposite, returnData, space, w;
    graph(vars, {
      buffer: true,
      mouse: true
    });
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return [];
    }
    discrete = vars.axes.discrete;
    opposite = vars.axes.opposite;
    disMargin = discrete === "x" ? vars.axes.margin.left : vars.axes.margin.top;
    oppMargin = opposite === "x" ? vars.axes.margin.left : vars.axes.margin.top;
    h = discrete === "x" ? "height" : "width";
    w = discrete === "x" ? "width" : "height";
    space = vars.axes[w] / vars[discrete].ticks.values.length;
    space = d3.min([space - vars.labels.padding * 2, 100]);
    mode = vars.type.mode.value;
    if (!(mode instanceof Array)) {
      mode = [mode, mode];
    }
    mergeData = function(arr) {
      var key, obj, vals;
      obj = {};
      for (key in vars.data.keys) {
        vals = uniques(arr, key, fetchValue, vars);
        obj[key] = vals.length === 1 ? vals[0] : vals;
      }
      return obj;
    };
    noData = false;
    medians = [];
    returnData = [];
    d3.nest().key(function(d) {
      return fetchValue(vars, d, vars[discrete].value);
    }).rollup(function(leaves) {
      var bottom, bottomLabel, bottomWhisker, boxData, d, diff1, diff2, first, i, iqr, j, key, label, len, len1, median, medianBuffer, medianData, medianHeight, medianText, outliers, scale, second, tooltipData, top, topLabel, topWhisker, uniqs, val, values, x, y;
      scale = vars[opposite].scale.viz;
      values = leaves.map(function(d) {
        return fetchValue(vars, d, vars[opposite].value);
      });
      values.sort(function(a, b) {
        return a - b;
      });
      uniqs = uniques(values);
      first = d3.quantile(values, 0.25);
      median = d3.quantile(values, 0.50);
      second = d3.quantile(values, 0.75);
      tooltipData = {};
      if (mode[1] === "tukey") {
        iqr = first - second;
        top = second - iqr * 1.5;
        topLabel = "top tukey";
      } else if (mode[1] === "extent") {
        top = d3.max(values);
        topLabel = "maximum";
      } else if (typeof mode[1] === "number") {
        top = d3.quantile(values, (100 - mode[1]) / 100);
        topLabel = mode[1] + " percentile";
      }
      top = d3.min([d3.max(values), top]);
      if (vars.tooltip.extent.value) {
        tooltipData[topLabel] = {
          key: vars[opposite].value,
          value: top
        };
      }
      if (vars.tooltip.iqr.value) {
        tooltipData["third quartile"] = {
          key: vars[opposite].value,
          value: second
        };
        tooltipData["median"] = {
          key: vars[opposite].value,
          value: median
        };
        tooltipData["first quartile"] = {
          key: vars[opposite].value,
          value: first
        };
      }
      if (mode[0] === "tukey") {
        iqr = first - second;
        bottom = first + iqr * 1.5;
        bottomLabel = "bottom tukey";
      } else if (mode[0] === "extent") {
        bottom = d3.min(values);
        bottomLabel = "minimum";
      } else if (typeof mode[0] === "number") {
        bottom = d3.quantile(values, mode[0] / 100);
        bottomLabel = mode[0] + " percentile";
      }
      bottom = d3.max([d3.min(values), bottom]);
      if (vars.tooltip.extent.value) {
        tooltipData[bottomLabel] = {
          key: vars[opposite].value,
          value: bottom
        };
      }
      boxData = [];
      bottomWhisker = [];
      topWhisker = [];
      outliers = [];
      for (i = 0, len = leaves.length; i < len; i++) {
        d = leaves[i];
        val = fetchValue(vars, d, vars[opposite].value);
        if (val >= first && val <= second) {
          boxData.push(d);
        } else if (val >= bottom && val < first) {
          bottomWhisker.push(d);
        } else if (val <= top && val > second) {
          topWhisker.push(d);
        } else {
          outliers.push(d);
        }
      }
      key = fetchValue(vars, leaves[0], vars[discrete].value);
      x = vars[discrete].scale.viz(key);
      x += disMargin;
      label = vars.format.value(key, {
        key: vars[discrete].value,
        vars: vars
      });
      if (key.constructor === Date) {
        key = key.getTime();
      }
      key = strip(key);
      boxData = mergeData(boxData);
      boxData.d3plus = {
        color: "white",
        id: "box_" + key,
        init: {},
        label: false,
        shape: "square",
        stroke: "#444",
        text: "Interquartile Range for " + label
      };
      boxData.d3plus[w] = space;
      boxData.d3plus.init[w] = space;
      boxData.d3plus[h] = Math.abs(scale(first) - scale(second));
      boxData.d3plus[discrete] = x;
      y = d3.min([scale(first), scale(second)]) + boxData.d3plus[h] / 2;
      y += oppMargin;
      boxData.d3plus[opposite] = y;
      boxData.d3plus.tooltip = tooltipData;
      returnData.push(boxData);
      medianData = {
        d3plus: {
          id: "median_line_" + key,
          position: h === "height" ? "top" : "right",
          shape: "whisker",
          "static": true
        }
      };
      medianText = vars.format.value(median, {
        key: vars[opposite].value,
        vars: vars
      });
      label = {
        background: "#fff",
        names: [medianText],
        padding: 0,
        resize: false,
        x: 0,
        y: 0
      };
      diff1 = Math.abs(scale(median) - scale(first));
      diff2 = Math.abs(scale(median) - scale(second));
      medianHeight = d3.min([diff1, diff2]) * 2;
      medianBuffer = vars.data.stroke.width * 2 + vars.labels.padding * 2;
      label[w === "width" ? "w" : "h"] = space - medianBuffer;
      label[h === "width" ? "w" : "h"] = medianHeight - medianBuffer;
      medianData.d3plus.label = label;
      medianData.d3plus[w] = space;
      medianData.d3plus[discrete] = x;
      medianData.d3plus[opposite] = scale(median) + oppMargin;
      returnData.push(medianData);
      bottomWhisker = mergeData(bottomWhisker);
      bottomWhisker.d3plus = {
        id: "bottom_whisker_line_" + key,
        offset: boxData.d3plus[h] / 2,
        position: h === "height" ? "bottom" : "left",
        shape: "whisker",
        "static": true
      };
      if (opposite === "x") {
        bottomWhisker.d3plus.offset *= -1;
      }
      bottomWhisker.d3plus[h] = Math.abs(scale(bottom) - scale(first));
      bottomWhisker.d3plus[w] = space;
      bottomWhisker.d3plus[discrete] = x;
      bottomWhisker.d3plus[opposite] = y;
      returnData.push(bottomWhisker);
      topWhisker = mergeData(topWhisker);
      topWhisker.d3plus = {
        id: "top_whisker_line_" + key,
        offset: boxData.d3plus[h] / 2,
        position: h === "height" ? "top" : "right",
        shape: "whisker",
        "static": true
      };
      if (opposite === "y") {
        topWhisker.d3plus.offset *= -1;
      }
      topWhisker.d3plus[h] = Math.abs(scale(top) - scale(second));
      topWhisker.d3plus[w] = space;
      topWhisker.d3plus[discrete] = x;
      topWhisker.d3plus[opposite] = y;
      returnData.push(topWhisker);
      for (j = 0, len1 = outliers.length; j < len1; j++) {
        d = outliers[j];
        d.d3plus[discrete] = x;
        d.d3plus[opposite] = scale(fetchValue(vars, d, vars.y.value));
        d.d3plus[opposite] += oppMargin;
        d.d3plus.r = 4;
        d.d3plus.shape = vars.shape.value;
      }
      noData = !outliers.length && top - bottom === 0;
      medians.push(median);
      returnData = returnData.concat(outliers);
      return leaves;
    }).entries(vars.data.viz);
    if (noData && uniques(medians).length === 1) {
      return [];
    } else {
      return returnData;
    }
  };

  box.modes = ["tukey", "extent", Array, Number];

  box.requirements = ["data", "x", "y"];

  box.shapes = ["circle", "check", "cross", "diamond", "square", "triangle", "triangle_up", "triangle_down"];

  box.setup = function(vars) {
    var axis;
    if (!vars.axes.discrete) {
      axis = vars.time.value === vars.y.value ? "y" : "x";
      return vars.self[axis]({
        scale: "discrete"
      });
    }
  };

  module.exports = box;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/box.js.map