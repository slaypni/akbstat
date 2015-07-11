(function() {
  var angles, largestRect, path2poly, shapeStyle;

  shapeStyle = require("./style.coffee");

  largestRect = require("../../../geom/largestRect.coffee");

  path2poly = require("../../../geom/path2poly.coffee");

  angles = {
    start: {},
    end: {}
  };

  module.exports = function(vars, selection, enter, exit) {
    var arc, arcTween, data, newarc;
    arc = d3.svg.arc().innerRadius(0).outerRadius(function(d) {
      return d.d3plus.r;
    }).startAngle(function(d) {
      return d.d3plus.startAngle;
    }).endAngle(function(d) {
      return d.d3plus.endAngle;
    });
    data = function(d) {
      var poly, rect;
      if (vars.labels.value) {
        if (d.d3plus.label) {
          d.d3plus_label = d.d3plus.label;
        } else {
          poly = path2poly(arc(d));
          rect = largestRect(poly, {
            angle: 0
          });
          if (rect[0]) {
            d.d3plus_label = {
              w: rect[0].width,
              h: rect[0].height,
              x: rect[0].cx,
              y: rect[0].cy
            };
          } else {
            delete d.d3plus_label;
          }
        }
      }
      return [d];
    };
    if (vars.draw.timing) {
      newarc = d3.svg.arc().innerRadius(0).outerRadius(function(d) {
        return d.d3plus.r;
      }).startAngle(function(d) {
        if (angles.start[d.d3plus.id] === void 0) {
          angles.start[d.d3plus.id] = 0;
        }
        if (isNaN(angles.start[d.d3plus.id])) {
          angles.start[d.d3plus.id] = d.d3plus.startAngle;
        }
        return angles.start[d.d3plus.id];
      }).endAngle(function(d) {
        if (angles.end[d.d3plus.id] === void 0) {
          angles.end[d.d3plus.id] = 0;
        }
        if (isNaN(angles.end[d.d3plus.id])) {
          angles.end[d.d3plus.id] = d.d3plus.endAngle;
        }
        return angles.end[d.d3plus.id];
      });
      arcTween = function(arcs, newAngle) {
        return arcs.attrTween("d", function(d) {
          var e, interpolateE, interpolateS, s;
          if (newAngle === void 0) {
            s = d.d3plus.startAngle;
            e = d.d3plus.endAngle;
          } else if (newAngle === 0) {
            s = 0;
            e = 0;
          }
          interpolateS = d3.interpolate(angles.start[d.d3plus.id], s);
          interpolateE = d3.interpolate(angles.end[d.d3plus.id], e);
          return function(t) {
            angles.start[d.d3plus.id] = interpolateS(t);
            angles.end[d.d3plus.id] = interpolateE(t);
            return newarc(d);
          };
        });
      };
      enter.append("path").attr("class", "d3plus_data").call(shapeStyle, vars).attr("d", newarc);
      selection.selectAll("path.d3plus_data").data(data).transition().duration(vars.draw.timing).call(shapeStyle, vars).call(arcTween);
      exit.selectAll("path.d3plus_data").transition().duration(vars.draw.timing).call(arcTween, 0);
    } else {
      enter.append("path").attr("class", "d3plus_data");
      selection.selectAll("path.d3plus_data").data(data).call(shapeStyle, vars).attr("d", arc);
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/arc.js.map