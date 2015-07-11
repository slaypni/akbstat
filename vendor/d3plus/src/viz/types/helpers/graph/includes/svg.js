(function() {
  var mix, textwrap, validObject;

  mix = require("../../../../../color/mix.coffee");

  textwrap = require("../../../../../textwrap/textwrap.coffee");

  validObject = require("../../../../../object/validate.coffee");

  module.exports = function(vars) {
    var affixes, alignMap, axis, axisData, axisLabel, bg, bgStyle, d, domain, domains, getFontStyle, grid, gridData, j, k, l, label, labelData, labelStyle, len, len1, len2, line, lineData, lineFont, lineGroup, lineRects, lineStyle, lines, linetexts, mirror, plane, planeTrans, position, rectData, rectStyle, ref, ref1, rotated, sep, textData, textPad, textPos, tickFont, tickPosition, tickStyle, userLines, xAxis, xEnter, xStyle, yAxis, yEnter, yStyle;
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return null;
    }
    bgStyle = {
      width: vars.axes.width,
      height: vars.axes.height,
      fill: vars.axes.background.color,
      stroke: vars.axes.background.stroke.color,
      "stroke-width": vars.axes.background.stroke.width,
      "shape-rendering": vars.axes.background.rendering.value
    };
    alignMap = {
      left: "start",
      center: "middle",
      right: "end"
    };
    axisData = vars.small ? [] : [0];
    tickPosition = function(tick, axis) {
      return tick.attr("x1", function(d) {
        if (axis === "x") {
          return vars.x.scale.viz(d);
        } else {
          return 0;
        }
      }).attr("x2", function(d) {
        if (axis === "x") {
          return vars.x.scale.viz(d);
        } else {
          return vars.axes.width;
        }
      }).attr("y1", function(d) {
        if (axis === "y") {
          return vars.y.scale.viz(d);
        } else {
          return 0;
        }
      }).attr("y2", function(d) {
        if (axis === "y") {
          return vars.y.scale.viz(d);
        } else {
          return vars.axes.height;
        }
      });
    };
    tickStyle = function(tick, axis, grid) {
      var color, log;
      color = grid ? vars[axis].grid.color : vars[axis].ticks.color;
      log = vars[axis].scale.value === "log";
      return tick.attr("stroke", function(d) {
        var visible;
        if (d === 0) {
          return vars[axis].axis.color;
        }
        if (d.constructor === Date) {
          d = +d;
        }
        visible = vars[axis].ticks.visible.indexOf(d) >= 0;
        if (visible && (!log || Math.abs(d).toString().charAt(0) === "1")) {
          return color;
        } else if (grid) {
          return mix(color, vars.axes.background.color, 0.4, 1);
        } else {
          return mix(color, vars.background.value, 0.4, 1);
        }
      }).attr("stroke-width", vars[axis].ticks.width).attr("shape-rendering", vars[axis].ticks.rendering.value);
    };
    getFontStyle = function(axis, val, style) {
      var type;
      type = val === 0 ? "axis" : "ticks";
      val = vars[axis][type].font[style];
      if (val && (val.length || typeof val === "number")) {
        return val;
      } else {
        return vars[axis].ticks.font[style];
      }
    };
    tickFont = function(tick, axis) {
      var log;
      log = vars[axis].scale.value === "log";
      return tick.attr("font-size", function(d) {
        return getFontStyle(axis, d, "size") + "px";
      }).attr("fill", function(d) {
        var color;
        color = getFontStyle(axis, d, "color");
        if (!log || Math.abs(d).toString().charAt(0) === "1") {
          return color;
        } else {
          return mix(color, vars.background.value, 0.4, 1);
        }
      }).attr("font-family", function(d) {
        return getFontStyle(axis, d, "family").value;
      }).attr("font-weight", function(d) {
        return getFontStyle(axis, d, "weight");
      });
    };
    lineStyle = function(line, axis) {
      var max, opp;
      max = axis === "x" ? "height" : "width";
      opp = axis === "x" ? "y" : "x";
      return line.attr(opp + "1", 0).attr(opp + "2", vars.axes[max]).attr(axis + "1", function(d) {
        return d.coords.line;
      }).attr(axis + "2", function(d) {
        return d.coords.line;
      }).attr("stroke", function(d) {
        return d.color || vars[axis].lines.color;
      }).attr("stroke-width", vars[axis].lines.width).attr("shape-rendering", vars[axis].lines.rendering.value).attr("stroke-dasharray", vars[axis].lines.dasharray.value);
    };
    lineFont = function(text, axis) {
      var opp;
      opp = axis === "x" ? "y" : "x";
      return text.attr(opp, function(d) {
        return d.coords.text[opp] + "px";
      }).attr(axis, function(d) {
        return d.coords.text[axis] + "px";
      }).attr("dy", vars[axis].lines.font.position.value).attr("text-anchor", alignMap[vars[axis].lines.font.align.value]).attr("transform", function(d) {
        return d.transform;
      }).attr("font-size", vars[axis].lines.font.size + "px").attr("fill", function(d) {
        return d.color || vars[axis].lines.color;
      }).attr("font-family", vars[axis].lines.font.family.value).attr("font-weight", vars[axis].lines.font.weight);
    };
    planeTrans = "translate(" + vars.axes.margin.left + "," + vars.axes.margin.top + ")";
    plane = vars.group.selectAll("g#d3plus_graph_plane").data([0]);
    plane.transition().duration(vars.draw.timing).attr("transform", planeTrans);
    plane.enter().append("g").attr("id", "d3plus_graph_plane").attr("transform", planeTrans);
    bg = plane.selectAll("rect#d3plus_graph_background").data([0]);
    bg.transition().duration(vars.draw.timing).attr(bgStyle);
    bg.enter().append("rect").attr("id", "d3plus_graph_background").attr("x", 0).attr("y", 0).attr(bgStyle);
    mirror = plane.selectAll("path#d3plus_graph_mirror").data([0]);
    mirror.enter().append("path").attr("id", "d3plus_graph_mirror").attr("fill", "#000").attr("fill-opacity", 0.03).attr("stroke-width", 1).attr("stroke", "#ccc").attr("stroke-dasharray", "10,10").attr("opacity", 0);
    mirror.transition().duration(vars.draw.timing).attr("opacity", function() {
      if (vars.axes.mirror.value) {
        return 1;
      } else {
        return 0;
      }
    }).attr("d", function() {
      var h, w;
      w = bgStyle.width;
      h = bgStyle.height;
      return "M " + w + " " + h + " L 0 " + h + " L " + w + " 0 Z";
    });
    rotated = vars.x.ticks.rotate !== 0;
    xStyle = function(axis) {
      var groups;
      groups = axis.attr("transform", "translate(0," + vars.axes.height + ")").call(vars.x.axis.svg.scale(vars.x.scale.viz)).selectAll("g.tick");
      groups.selectAll("line").attr("y2", function(d) {
        var y2;
        if (d.constructor === Date) {
          d = +d;
        }
        y2 = d3.select(this).attr("y2");
        if (vars.x.ticks.visible.indexOf(d) >= 0) {
          return y2;
        } else {
          return y2 / 2;
        }
      });
      return groups.select("text").attr("dy", "").style("text-anchor", rotated ? "end" : "middle").call(tickFont, "x").each("end", function(d) {
        if (d.constructor === Date) {
          d = +d;
        }
        if (!vars.x.ticks.hidden && vars.x.ticks.visible.indexOf(d) >= 0) {
          return textwrap().container(d3.select(this)).rotate(vars.x.ticks.rotate).valign(rotated ? "middle" : "top").width(vars.x.ticks.maxWidth).height(vars.x.ticks.maxHeight).padding(0).x(-vars.x.ticks.maxWidth / 2).draw();
        }
      });
    };
    xAxis = plane.selectAll("g#d3plus_graph_xticks").data(axisData);
    xAxis.transition().duration(vars.draw.timing).call(xStyle);
    xAxis.selectAll("line").transition().duration(vars.draw.timing).call(tickStyle, "x");
    xEnter = xAxis.enter().append("g").attr("id", "d3plus_graph_xticks").transition().duration(0).call(xStyle);
    xEnter.selectAll("path").attr("fill", "none");
    xEnter.selectAll("line").call(tickStyle, "x");
    xAxis.exit().transition().duration(vars.data.timing).attr("opacity", 0).remove();
    yStyle = function(axis) {
      var groups;
      groups = axis.call(vars.y.axis.svg.scale(vars.y.scale.viz)).selectAll("g.tick");
      groups.selectAll("line").attr("y2", function(d) {
        var y2;
        if (d.constructor === Date) {
          d = +d;
        }
        y2 = d3.select(this).attr("y2");
        if (vars.x.ticks.visible.indexOf(d) >= 0) {
          return y2;
        } else {
          return y2 / 2;
        }
      });
      return groups.select("text").call(tickFont, "y");
    };
    yAxis = plane.selectAll("g#d3plus_graph_yticks").data(axisData);
    yAxis.transition().duration(vars.draw.timing).call(yStyle);
    yAxis.selectAll("line").transition().duration(vars.draw.timing).call(tickStyle, "y");
    yEnter = yAxis.enter().append("g").attr("id", "d3plus_graph_yticks").call(yStyle);
    yEnter.selectAll("path").attr("fill", "none");
    yEnter.selectAll("line").call(tickStyle, "y");
    yAxis.exit().transition().duration(vars.data.timing).attr("opacity", 0).remove();
    labelStyle = function(label, axis) {
      return label.attr("x", axis === "x" ? vars.width.viz / 2 : -(vars.axes.height / 2 + vars.axes.margin.top)).attr("y", axis === "x" ? vars.height.viz - vars[axis].label.height / 2 - vars[axis].label.padding : vars[axis].label.height / 2 + vars[axis].label.padding).attr("transform", axis === "y" ? "rotate(-90)" : null).attr("font-family", vars[axis].label.font.family.value).attr("font-weight", vars[axis].label.font.weight).attr("font-size", vars[axis].label.font.size + "px").attr("fill", vars[axis].label.font.color).style("text-anchor", "middle").attr("dominant-baseline", "central");
    };
    ref = ["x", "y"];
    for (j = 0, len = ref.length; j < len; j++) {
      axis = ref[j];
      if (vars[axis].grid.value) {
        gridData = vars[axis].ticks.values;
      } else {
        gridData = [];
        if (vars[axis].ticks.values.indexOf(0) >= 0 && vars[axis].axis.value) {
          gridData = [0];
        }
      }
      grid = plane.selectAll("g#d3plus_graph_" + axis + "grid").data([0]);
      grid.enter().append("g").attr("id", "d3plus_graph_" + axis + "grid");
      lines = grid.selectAll("line").data(gridData, function(d, i) {
        if (d.constructor === Date) {
          return d.getTime();
        } else {
          return d;
        }
      });
      lines.transition().duration(vars.draw.timing).call(tickPosition, axis).call(tickStyle, axis, true);
      lines.enter().append("line").style("opacity", 0).call(tickPosition, axis).call(tickStyle, axis, true).transition().duration(vars.draw.timing).delay(vars.draw.timing / 2).style("opacity", 1);
      lines.exit().transition().duration(vars.draw.timing / 2).style("opacity", 0).remove();
      axisLabel = vars[axis].label.fetch(vars);
      labelData = axisData && axisLabel ? [0] : [];
      affixes = vars.format.affixes.value[vars[axis].value];
      if (axisLabel && !vars[axis].affixes.value && affixes) {
        sep = vars[axis].affixes.separator.value;
        if (sep === true) {
          sep = ["[", "]"];
        } else if (sep === false) {
          sep = ["", ""];
        }
        axisLabel += " " + sep[0] + affixes[0] + " " + affixes[1] + sep[1];
      }
      label = vars.group.selectAll("text#d3plus_graph_" + axis + "label").data(labelData);
      label.text(axisLabel).transition().duration(vars.draw.timing).call(labelStyle, axis);
      label.enter().append("text").attr("id", "d3plus_graph_" + axis + "label").text(axisLabel).call(labelStyle, axis);
      label.exit().transition().duration(vars.data.timing).attr("opacity", 0).remove();
    }
    ref1 = ["x", "y"];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      axis = ref1[k];
      lineGroup = plane.selectAll("g#d3plus_graph_" + axis + "_userlines").data([0]);
      lineGroup.enter().append("g").attr("id", "d3plus_graph_" + axis + "_userlines");
      domain = vars[axis].scale.viz.domain();
      if (axis === "y") {
        domain = domain.slice().reverse();
      }
      textData = [];
      lineData = [];
      userLines = vars[axis].lines.value || [];
      for (l = 0, len2 = userLines.length; l < len2; l++) {
        line = userLines[l];
        d = validObject(line) ? line.position : line;
        if (!isNaN(d)) {
          d = parseFloat(d);
          if (d > domain[0] && d < domain[1]) {
            d = !validObject(line) ? {
              "position": d
            } : line;
            d.coords = {
              line: vars[axis].scale.viz(d.position)
            };
            lineData.push(d);
            if (d.text) {
              d.axis = axis;
              d.padding = vars[axis].lines.font.padding.value * 0.5;
              d.align = vars[axis].lines.font.align.value;
              position = vars[axis].lines.font.position.text;
              textPad = position === "middle" ? 0 : d.padding * 2;
              if (position === "top") {
                textPad = -textPad;
              }
              if (axis === "x") {
                textPos = d.align === "left" ? vars.axes.height : d.align === "center" ? vars.axes.height / 2 : 0;
                if (d.align === "left") {
                  textPos -= d.padding * 2;
                }
                if (d.align === "right") {
                  textPos += d.padding * 2;
                }
              } else {
                textPos = d.align === "left" ? 0 : d.align === "center" ? vars.axes.width / 2 : vars.axes.width;
                if (d.align === "right") {
                  textPos -= d.padding * 2;
                }
                if (d.align === "left") {
                  textPos += d.padding * 2;
                }
              }
              d.coords.text = {};
              d.coords.text[axis === "x" ? "y" : "x"] = textPos;
              d.coords.text[axis] = vars[axis].scale.viz(d.position) + textPad;
              d.transform = axis === "x" ? "rotate(-90," + d.coords.text.x + "," + d.coords.text.y + ")" : null;
              textData.push(d);
            }
          }
        }
      }
      lines = lineGroup.selectAll("line.d3plus_graph_" + axis + "line").data(lineData, function(d) {
        return d.position;
      });
      lines.enter().append("line").attr("class", "d3plus_graph_" + axis + "line").attr("opacity", 0).call(lineStyle, axis);
      lines.transition().duration(vars.draw.timing).attr("opacity", 1).call(lineStyle, axis);
      lines.exit().transition().duration(vars.draw.timing).attr("opacity", 0).remove();
      linetexts = lineGroup.selectAll("text.d3plus_graph_" + axis + "line_text").data(textData, function(d) {
        return d.position;
      });
      linetexts.enter().append("text").attr("class", "d3plus_graph_" + axis + "line_text").attr("id", function(d) {
        var id;
        id = d.position + "";
        id = id.replace("-", "neg");
        id = id.replace(".", "p");
        return "d3plus_graph_" + axis + "line_text_" + id;
      }).attr("opacity", 0).call(lineFont, axis);
      linetexts.text(function(d) {
        return d.text;
      }).transition().duration(vars.draw.timing).attr("opacity", 1).call(lineFont, axis);
      linetexts.exit().transition().duration(vars.draw.timing).attr("opacity", 0).remove();
      rectStyle = function(rect) {
        var getText;
        getText = function(d) {
          var id;
          id = d.position + "";
          id = id.replace("-", "neg");
          id = id.replace(".", "p");
          return plane.select("text#d3plus_graph_" + d.axis + "line_text_" + id).node().getBBox();
        };
        return rect.attr("x", function(d) {
          return getText(d).x - d.padding;
        }).attr("y", function(d) {
          return getText(d).y - d.padding;
        }).attr("transform", function(d) {
          return d.transform;
        }).attr("width", function(d) {
          return getText(d).width + (d.padding * 2);
        }).attr("height", function(d) {
          return getText(d).height + (d.padding * 2);
        }).attr("fill", vars.axes.background.color);
      };
      rectData = vars[axis].lines.font.background.value ? textData : [];
      lineRects = lineGroup.selectAll("rect.d3plus_graph_" + axis + "line_rect").data(rectData, function(d) {
        return d.position;
      });
      lineRects.enter().insert("rect", "text.d3plus_graph_" + axis + "line_text").attr("class", "d3plus_graph_" + axis + "line_rect").attr("pointer-events", "none").attr("opacity", 0).call(rectStyle);
      lineRects.transition().delay(vars.draw.timing).each("end", function(d) {
        return d3.select(this).transition().duration(vars.draw.timing).attr("opacity", 1).call(rectStyle);
      });
      lineRects.exit().transition().duration(vars.draw.timing).attr("opacity", 0).remove();
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/helpers/graph/includes/svg.js.map