(function() {
  var copy, events, fetchColor, fetchValue, legible;

  copy = require("../../../../../util/copy.coffee");

  events = require("../../../../../client/pointer.coffee");

  fetchColor = require("../../../../../core/fetch/color.coffee");

  fetchValue = require("../../../../../core/fetch/value.coffee");

  legible = require("../../../../../color/legible.coffee");

  module.exports = function(node, vars) {
    var clickRemove, color, create, graph, lineData, lineInit, lineStyle, lineUpdate, lines, r, rectStyle, rects, s, textStyle, texts, timing, x, y;
    clickRemove = d3.event.type === events.click && (vars.tooltip.value.long || vars.tooltip.html.value);
    create = [events.over, events.move].indexOf(d3.event.type) >= 0;
    x = node.d3plus.x;
    y = node.d3plus.y;
    r = node.d3plus.r || 0;
    s = vars.types[vars.type.value].scale || 1;
    r = r * s;
    graph = vars.axes;
    timing = vars.draw.timing ? vars.timing.mouseevents : 0;
    if (!clickRemove && create) {
      color = legible(fetchColor(vars, node));
      lineData = ["x", "y"].filter(function(axis) {
        var val;
        val = fetchValue(vars, node, vars[axis].value);
        return !(val instanceof Array) && axis !== vars.axes.stacked && vars[axis].mouse.value && axis !== vars.axes.discrete;
      });
    } else {
      lineData = [];
    }
    lineInit = function(line) {
      return line.attr("x1", function(d) {
        if (d === "x") {
          return x;
        } else {
          return x - r;
        }
      }).attr("y1", function(d) {
        if (d === "y") {
          return y;
        } else {
          return y + r;
        }
      }).attr("x2", function(d) {
        if (d === "x") {
          return x;
        } else {
          return x - r;
        }
      }).attr("y2", function(d) {
        if (d === "y") {
          return y;
        } else {
          return y + r;
        }
      }).attr("opacity", 0);
    };
    lineStyle = function(line) {
      return line.style("stroke", function(d) {
        if (vars.shape.value === "area") {
          return "white";
        } else {
          return color;
        }
      }).attr("stroke-dasharray", function(d) {
        return vars[d].mouse.dasharray.value;
      }).attr("shape-rendering", function(d) {
        return vars[d].mouse.rendering.value;
      }).style("stroke-width", function(d) {
        return vars[d].mouse.width;
      });
    };
    lineUpdate = function(line) {
      return line.attr("x1", function(d) {
        if (d === "x") {
          return x;
        } else {
          return x - r;
        }
      }).attr("y1", function(d) {
        if (d === "y") {
          return y;
        } else {
          return y + r;
        }
      }).attr("x2", function(d) {
        if (d === "x") {
          return x;
        } else {
          return node.d3plus.x0 || graph.margin.left - vars[d].ticks.size;
        }
      }).attr("y2", function(d) {
        if (d === "y") {
          return y;
        } else {
          return node.d3plus.y0 || graph.height + graph.margin.top + vars[d].ticks.size;
        }
      }).style("opacity", 1);
    };
    lines = vars.g.labels.selectAll("line.d3plus_mouse_axis_label").data(lineData);
    if (timing) {
      lines.enter().append("line").attr("class", "d3plus_mouse_axis_label").attr("pointer-events", "none").call(lineInit).call(lineStyle);
      lines.transition().duration(timing).call(lineUpdate).call(lineStyle);
      lines.exit().transition().duration(timing).call(lineInit).remove();
    } else {
      lines.call(lineUpdate).call(lineStyle);
      lines.enter().append("line").attr("class", "d3plus_mouse_axis_label").attr("pointer-events", "none").call(lineInit).call(lineStyle);
      lines.exit().remove();
    }
    textStyle = function(text) {
      return text.attr("font-size", function(d) {
        return vars[d].ticks.font.size + "px";
      }).attr("fill", function(d) {
        return vars[d].ticks.font.color;
      }).attr("font-family", function(d) {
        return vars[d].ticks.font.family.value;
      }).attr("font-weight", function(d) {
        return vars[d].ticks.font.weight;
      }).attr("x", function(d) {
        if (d === "x") {
          return x;
        } else {
          return graph.margin.left - 5 - vars[d].ticks.size;
        }
      }).attr("y", function(d) {
        if (d === "y") {
          return y;
        } else {
          if (node.d3plus.y0) {
            return node.d3plus.y + (node.d3plus.y0 - node.d3plus.y) / 2 + graph.margin.top - 6;
          } else {
            return graph.height + graph.margin.top + 5 + vars[d].ticks.size;
          }
        }
      }).attr("fill", vars.shape.value === "area" ? "white" : color);
    };
    texts = vars.g.labels.selectAll("text.d3plus_mouse_axis_label").data(lineData);
    texts.enter().append("text").attr("class", "d3plus_mouse_axis_label").attr("id", function(d) {
      return d + "_d3plusmouseaxislabel";
    }).attr("dy", function(d) {
      if (d === "y") {
        return vars[d].ticks.font.size * 0.35;
      } else {
        return vars[d].ticks.font.size;
      }
    }).style("text-anchor", function(d) {
      if (d === "y") {
        return "end";
      } else {
        return "middle";
      }
    }).attr("opacity", 0).attr("pointer-events", "none").call(textStyle);
    texts.text(function(d) {
      var axis, val;
      axis = vars.axes.stacked || d;
      val = fetchValue(vars, node, vars[axis].value);
      return vars.format.value(val, {
        key: vars[axis].value,
        vars: vars,
        labels: vars[axis].affixes.value
      });
    });
    if (timing) {
      texts.transition().duration(timing).delay(timing).attr("opacity", 1).call(textStyle);
      texts.exit().transition().duration(timing).attr("opacity", 0).remove();
    } else {
      texts.attr("opacity", 1).call(textStyle);
      texts.exit().remove();
    }
    rectStyle = function(rect) {
      var getText;
      getText = function(axis) {
        return d3.select("text#" + axis + "_d3plusmouseaxislabel").node().getBBox();
      };
      return rect.attr("x", function(d) {
        var width;
        width = getText(d).width;
        if (d === "x") {
          return x - width / 2 - 5;
        } else {
          return graph.margin.left - vars[d].ticks.size - width - 10;
        }
      }).attr("y", function(d) {
        var mod;
        mod = getText(d).height / 2 + 5;
        if (d === "y") {
          return y - mod;
        } else {
          if (node.d3plus.y0) {
            return node.d3plus.y + (node.d3plus.y0 - node.d3plus.y) / 2 + graph.margin.top - mod;
          } else {
            return graph.height + graph.margin.top + vars[d].ticks.size;
          }
        }
      }).attr("width", function(d) {
        return getText(d).width + 10;
      }).attr("height", function(d) {
        return getText(d).height + 10;
      }).style("stroke", vars.shape.value === "area" ? "transparent" : color).attr("fill", vars.shape.value === "area" ? color : vars.background.value).attr("shape-rendering", function(d) {
        return vars[d].mouse.rendering.value;
      }).style("stroke-width", function(d) {
        return vars[d].mouse.width;
      });
    };
    rects = vars.g.labels.selectAll("rect.d3plus_mouse_axis_label").data(lineData);
    if (timing) {
      rects.enter().insert("rect", "text.d3plus_mouse_axis_label").attr("class", "d3plus_mouse_axis_label").attr("pointer-events", "none").attr("opacity", 0).call(rectStyle);
      rects.transition().duration(timing).delay(timing).attr("opacity", 1).call(rectStyle);
      return rects.exit().transition().duration(timing).attr("opacity", 0).remove();
    } else {
      rects.attr("opacity", 1).call(rectStyle);
      rects.enter().insert("rect", "text.d3plus_mouse_axis_label").attr("class", "d3plus_mouse_axis_label").attr("pointer-events", "none").call(rectStyle);
      return rects.exit().remove();
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/helpers/graph/includes/mouse.js.map