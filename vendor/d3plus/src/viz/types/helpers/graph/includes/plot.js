(function() {
  var buckets, buffer, createAxis, fetchValue, fontSizes, formatPower, labelPadding, resetMargins, superscript, textwrap, timeDetect, uniques;

  buckets = require("../../../../../util/buckets.coffee");

  buffer = require("./buffer.coffee");

  fetchValue = require("../../../../../core/fetch/value.coffee");

  fontSizes = require("../../../../../font/sizes.coffee");

  textwrap = require("../../../../../textwrap/textwrap.coffee");

  timeDetect = require("../../../../../core/data/time.coffee");

  uniques = require("../../../../../util/uniques.coffee");

  module.exports = function(vars, opts) {
    var axes, axis, axisStyle, extent, j, k, len, len1, newtick, opp, ref, step, tens, tick, ticks, timeReturn, values;
    vars.axes.margin = resetMargins(vars);
    vars.axes.height = vars.height.viz;
    vars.axes.width = vars.width.viz;
    axes = vars.width.viz > vars.height.viz ? ["y", "x"] : ["x", "y"];
    for (j = 0, len = axes.length; j < len; j++) {
      axis = axes[j];
      if (vars[axis].ticks.values === false) {
        if (vars[axis].value === vars.time.value) {
          ticks = vars.time.solo.value;
          if (ticks.length) {
            ticks = ticks.map(function(d) {
              if (d.constructor !== Date) {
                d = d + "";
                if (d.length === 4 && parseInt(d) + "" === d) {
                  d += "/01/01";
                }
                d = new Date(d);
              }
              return d;
            });
          } else {
            ticks = vars.data.time.values;
          }
          extent = d3.extent(ticks);
          step = vars.data.time.stepType;
          ticks = [extent[0]];
          tick = extent[0];
          while (tick < extent[1]) {
            newtick = new Date(tick);
            tick = new Date(newtick["set" + step](newtick["get" + step]() + 1));
            ticks.push(tick);
          }
          vars[axis].ticks.values = ticks;
        } else {
          vars[axis].ticks.values = vars[axis].scale.viz.ticks();
        }
      }
      if (!vars[axis].ticks.values.length) {
        values = fetchValue(vars, vars.data.viz, vars[axis].value);
        if (!(values instanceof Array)) {
          values = [values];
        }
        vars[axis].ticks.values = values;
      }
      opp = axis === "x" ? "y" : "x";
      if (vars[axis].ticks.values.length === 1 || (opts.buffer && opts.buffer !== opp && axis === vars.axes.discrete && vars[axis].reset === true)) {
        buffer(vars, axis, opts.buffer);
      }
      vars[axis].reset = false;
      if (vars[axis].value === vars.time.value) {
        axisStyle = {
          "font-family": vars[axis].ticks.font.family.value,
          "font-weight": vars[axis].ticks.font.weight,
          "font-size": vars[axis].ticks.font.size + "px"
        };
        timeReturn = timeDetect(vars, {
          values: vars[axis].ticks.values,
          limit: vars.width.viz,
          style: axisStyle
        });
        vars[axis].ticks.visible = timeReturn.values.map(Number);
        vars[axis].ticks.format = timeReturn.format;
      } else if (vars[axis].scale.value === "log") {
        ticks = vars[axis].ticks.values;
        tens = ticks.filter(function(t) {
          return Math.abs(t).toString().charAt(0) === "1";
        });
        if (tens.length < 3) {
          vars[axis].ticks.visible = ticks;
        } else {
          vars[axis].ticks.visible = tens;
        }
      } else {
        vars[axis].ticks.visible = vars[axis].ticks.values;
      }
    }
    if (!vars.small) {
      labelPadding(vars);
    }
    ref = ["x", "y"];
    for (k = 0, len1 = ref.length; k < len1; k++) {
      axis = ref[k];
      vars[axis].axis.svg = createAxis(vars, axis);
    }
  };

  resetMargins = function(vars) {
    if (vars.small) {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    } else {
      return {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      };
    }
  };

  labelPadding = function(vars) {
    var lastTick, rightLabel, rightMod, xAttrs, xAxisHeight, xAxisWidth, xDomain, xLabel, xLabelAttrs, xMaxWidth, xSizes, xText, xValues, yAttrs, yAxisWidth, yDomain, yLabel, yLabelAttrs, yText, yValues;
    xDomain = vars.x.scale.viz.domain();
    yDomain = vars.y.scale.viz.domain();
    yAttrs = {
      "font-size": vars.y.ticks.font.size + "px",
      "font-family": vars.y.ticks.font.family.value,
      "font-weight": vars.y.ticks.font.weight
    };
    yValues = vars.y.ticks.visible;
    if (vars.y.scale.value === "log") {
      yText = yValues.map(function(d) {
        return formatPower(d);
      });
    } else if (vars.y.scale.value === "share") {
      yText = yValues.map(function(d) {
        return vars.format.value(d * 100, {
          key: "share",
          vars: vars
        });
      });
    } else if (vars.y.value === vars.time.value) {
      yText = yValues.map(function(d, i) {
        return vars.y.ticks.format(new Date(d));
      });
    } else {
      if (typeof yValues[0] === "string") {
        yValues = vars.y.scale.viz.domain().filter(function(d) {
          return d.indexOf("d3plus_buffer_") !== 0;
        });
      }
      yText = yValues.map(function(d) {
        return vars.format.value(d, {
          key: vars.y.value,
          vars: vars,
          labels: vars.y.affixes.value
        });
      });
    }
    yAxisWidth = d3.max(fontSizes(yText, yAttrs), function(d) {
      return d.width;
    });
    yAxisWidth = Math.ceil(yAxisWidth + vars.labels.padding);
    vars.axes.margin.left += yAxisWidth;
    yLabel = vars.y.label.fetch(vars);
    if (yLabel) {
      yLabelAttrs = {
        "font-family": vars.y.label.font.family.value,
        "font-weight": vars.y.label.font.weight,
        "font-size": vars.y.label.font.size + "px"
      };
      vars.y.label.height = fontSizes([yLabel], yLabelAttrs)[0].height;
    } else {
      vars.y.label.height = 0;
    }
    if (vars.y.label.value) {
      vars.axes.margin.left += vars.y.label.height;
      vars.axes.margin.left += vars.y.label.padding * 2;
    }
    vars.axes.width -= vars.axes.margin.left + vars.axes.margin.right;
    vars.x.scale.viz.range(buckets([0, vars.axes.width], xDomain.length));
    xAttrs = {
      "font-size": vars.x.ticks.font.size + "px",
      "font-family": vars.x.ticks.font.family.value,
      "font-weight": vars.x.ticks.font.weight
    };
    xValues = vars.x.ticks.visible;
    if (vars.x.scale.value === "log") {
      xText = xValues.map(function(d) {
        return formatPower(d);
      });
    } else if (vars.x.scale.value === "share") {
      xText = xValues.map(function(d) {
        return vars.format.value(d * 100, {
          key: "share",
          vars: vars
        });
      });
    } else if (vars.x.value === vars.time.value) {
      xText = xValues.map(function(d, i) {
        return vars.x.ticks.format(new Date(d));
      });
    } else {
      if (typeof xValues[0] === "string") {
        xValues = vars.x.scale.viz.domain().filter(function(d) {
          return d.indexOf("d3plus_buffer_") !== 0;
        });
      }
      xText = xValues.map(function(d) {
        return vars.format.value(d, {
          key: vars.x.value,
          vars: vars,
          labels: vars.x.affixes.value
        });
      });
    }
    xSizes = fontSizes(xText, xAttrs);
    xAxisWidth = d3.max(xSizes, function(d) {
      return d.width;
    });
    xAxisHeight = d3.max(xSizes, function(d) {
      return d.height;
    });
    if (xValues.length === 1) {
      xMaxWidth = vars.axes.width;
    } else {
      xMaxWidth = vars.x.scale.viz(xValues[1]) - vars.x.scale.viz(xValues[0]);
      xMaxWidth = Math.abs(xMaxWidth);
    }
    if (xAxisWidth > xMaxWidth && xText.join("").indexOf(" ") > 0) {
      vars.x.ticks.wrap = true;
      xSizes = fontSizes(xText, xAttrs, {
        mod: function(elem) {
          return textwrap().container(d3.select(elem)).height(vars.axes.height / 2).width(xMaxWidth).draw();
        }
      });
      xAxisWidth = d3.max(xSizes, function(d) {
        return d.width;
      });
      xAxisHeight = d3.max(xSizes, function(d) {
        return d.height;
      });
    } else {
      vars.x.ticks.wrap = false;
    }
    vars.x.ticks.hidden = false;
    vars.x.ticks.baseline = "auto";
    if (xAxisWidth <= xMaxWidth) {
      vars.x.ticks.rotate = 0;
    } else if (xAxisWidth < vars.axes.height / 2) {
      xSizes = fontSizes(xText, xAttrs, {
        mod: function(elem) {
          return textwrap().container(d3.select(elem)).width(vars.axes.height / 2).height(xMaxWidth).draw();
        }
      });
      xAxisHeight = d3.max(xSizes, function(d) {
        return d.width;
      });
      xAxisWidth = d3.max(xSizes, function(d) {
        return d.height;
      });
      vars.x.ticks.rotate = -90;
    } else {
      xAxisWidth = 0;
      xAxisHeight = 0;
    }
    if (!(xAxisWidth && xAxisHeight)) {
      vars.x.ticks.hidden = true;
      vars.x.ticks.rotate = 0;
    }
    xAxisWidth = Math.ceil(xAxisWidth);
    xAxisHeight = Math.ceil(xAxisHeight);
    xAxisWidth++;
    xAxisHeight++;
    vars.x.ticks.maxHeight = xAxisHeight;
    vars.x.ticks.maxWidth = xAxisWidth;
    vars.axes.margin.bottom += xAxisHeight + vars.labels.padding;
    lastTick = vars.x.ticks.visible[vars.x.ticks.visible.length - 1];
    rightLabel = vars.x.scale.viz(lastTick);
    rightLabel += xAxisWidth / 2 + vars.axes.margin.left;
    if (rightLabel > vars.width.value) {
      rightMod = rightLabel - vars.width.value + vars.axes.margin.right;
      vars.axes.width -= rightMod;
      vars.axes.margin.right += rightMod;
    }
    xLabel = vars.x.label.fetch(vars);
    if (xLabel) {
      xLabelAttrs = {
        "font-family": vars.x.label.font.family.value,
        "font-weight": vars.x.label.font.weight,
        "font-size": vars.x.label.font.size + "px"
      };
      vars.x.label.height = fontSizes([xLabel], xLabelAttrs)[0].height;
    } else {
      vars.x.label.height = 0;
    }
    if (vars.x.label.value) {
      vars.axes.margin.bottom += vars.x.label.height;
      vars.axes.margin.bottom += vars.x.label.padding * 2;
    }
    vars.axes.height -= vars.axes.margin.top + vars.axes.margin.bottom;
    vars.x.scale.viz.range(buckets([0, vars.axes.width], xDomain.length));
    return vars.y.scale.viz.range(buckets([0, vars.axes.height], yDomain.length));
  };

  createAxis = function(vars, axis) {
    return d3.svg.axis().tickSize(vars[axis].ticks.size).tickPadding(5).orient(axis === "x" ? "bottom" : "left").scale(vars[axis].scale.viz).tickValues(vars[axis].ticks.values).tickFormat(function(d, i) {
      var c, scale;
      if (vars[axis].ticks.hidden) {
        return null;
      }
      scale = vars[axis].scale.value;
      c = d.constructor === Date ? +d : d;
      if (vars[axis].ticks.visible.indexOf(c) >= 0) {
        if (scale === "share") {
          return vars.format.value(d * 100, {
            key: "share",
            vars: vars,
            labels: vars[axis].affixes.value
          });
        } else if (d.constructor === Date) {
          return vars[axis].ticks.format(d);
        } else if (scale === "log") {
          return formatPower(d);
        } else {
          return vars.format.value(d, {
            key: vars[axis].value,
            vars: vars,
            labels: vars[axis].affixes.value
          });
        }
      } else {
        return null;
      }
    });
  };

  superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";

  formatPower = function(d) {
    var n, p, t;
    p = Math.round(Math.log(Math.abs(d)) / Math.LN10);
    t = Math.abs(d).toString().charAt(0);
    n = 10 + " " + (p + "").split("").map(function(c) {
      return superscript[c];
    }).join("");
    if (t !== "1") {
      n = t + " x " + n;
    }
    if (d < 0) {
      return "-" + n;
    } else {
      return n;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/helpers/graph/includes/plot.js.map