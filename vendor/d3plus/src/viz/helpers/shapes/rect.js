(function() {
  var shapeStyle;

  shapeStyle = require("./style.coffee");

  module.exports = function(vars, selection, enter, exit) {
    var data, init, update;
    data = function(d) {
      var h, w;
      if (vars.labels.value && !d.d3plus.label) {
        w = (d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.width);
        h = (d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.height);
        d.d3plus_label = {
          w: w,
          h: h,
          x: 0,
          y: 0
        };
        d.d3plus_share = {
          w: w,
          h: h,
          x: 0,
          y: 0
        };
        d.d3plus_label.shape = (d.d3plus.shape === "circle" ? "circle" : "square");
      } else if (d.d3plus.label) {
        d.d3plus_label = d.d3plus.label;
      } else {
        delete d.d3plus_label;
      }
      return [d];
    };
    init = function(nodes) {
      return nodes.attr("x", function(d) {
        if (d.d3plus.init && "x" in d.d3plus.init) {
          return d.d3plus.init.x;
        } else {
          if (d.d3plus.init && "width" in d.d3plus.init) {
            return -d.d3plus.width / 2;
          } else {
            return 0;
          }
        }
      }).attr("y", function(d) {
        if (d.d3plus.init && "y" in d.d3plus.init) {
          return d.d3plus.init.y;
        } else {
          if (d.d3plus.init && "height" in d.d3plus.init) {
            return -d.d3plus.height / 2;
          } else {
            return 0;
          }
        }
      }).attr("width", function(d) {
        if (d.d3plus.init && "width" in d.d3plus.init) {
          return d.d3plus.init.width;
        } else {
          return 0;
        }
      }).attr("height", function(d) {
        if (d.d3plus.init && "height" in d.d3plus.init) {
          return d.d3plus.init.height;
        } else {
          return 0;
        }
      });
    };
    update = function(nodes) {
      return nodes.attr("x", function(d) {
        var w;
        w = d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.width;
        return -w / 2;
      }).attr("y", function(d) {
        var h;
        h = d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.height;
        return -h / 2;
      }).attr("width", function(d) {
        if (d.d3plus.r) {
          return d.d3plus.r * 2;
        } else {
          return d.d3plus.width;
        }
      }).attr("height", function(d) {
        if (d.d3plus.r) {
          return d.d3plus.r * 2;
        } else {
          return d.d3plus.height;
        }
      }).attr("rx", function(d) {
        var rounded, w;
        rounded = d.d3plus.shape === "circle";
        w = d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.width;
        if (rounded) {
          return (w + 2) / 2;
        } else {
          return 0;
        }
      }).attr("ry", function(d) {
        var h, rounded;
        rounded = d.d3plus.shape === "circle";
        h = d.d3plus.r ? d.d3plus.r * 2 : d.d3plus.height;
        if (rounded) {
          return (h + 2) / 2;
        } else {
          return 0;
        }
      }).attr("transform", function(d) {
        if ("rotate" in d.d3plus) {
          return "rotate(" + d.d3plus.rotate + ")";
        } else {
          return "";
        }
      }).attr("shape-rendering", function(d) {
        if (d.d3plus.shape === "square" && (!("rotate" in d.d3plus))) {
          return vars.shape.rendering.value;
        } else {
          return "auto";
        }
      });
    };
    if (vars.draw.timing) {
      enter.append("rect").attr("class", "d3plus_data").call(init).call(shapeStyle, vars);
      selection.selectAll("rect.d3plus_data").data(data).transition().duration(vars.draw.timing).call(update).call(shapeStyle, vars);
      return exit.selectAll("rect.d3plus_data").transition().duration(vars.draw.timing).call(init);
    } else {
      enter.append("rect").attr("class", "d3plus_data");
      return selection.selectAll("rect.d3plus_data").data(data).call(update).call(shapeStyle, vars);
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/rect.js.map