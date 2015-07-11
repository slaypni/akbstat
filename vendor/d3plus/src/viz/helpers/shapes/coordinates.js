(function() {
  var copy, distance, fetchText, fontSizes, labels, largestRect, path2poly, shapeStyle;

  copy = require("../../../util/copy.coffee");

  distance = require("../../../network/distance.coffee");

  fetchText = require("../../../core/fetch/text.js");

  fontSizes = require("../../../font/sizes.coffee");

  largestRect = require("../../../geom/largestRect.coffee");

  path2poly = require("../../../geom/path2poly.coffee");

  shapeStyle = require("./style.coffee");

  labels = {};

  module.exports = function(vars, selection, enter, exit) {
    var projection, size_change;
    projection = d3.geo[vars.coords.projection.value]().center(vars.coords.center);
    if (!vars.zoom.scale) {
      vars.zoom.scale = 1;
    }
    vars.zoom.area = 1 / vars.zoom.scale / vars.zoom.scale;
    vars.path = d3.geo.path().projection(projection);
    enter.append("path").attr("id", function(d) {
      return d.id;
    }).attr("class", "d3plus_data").attr("d", vars.path).call(shapeStyle, vars);
    if (vars.draw.timing) {
      selection.selectAll("path.d3plus_data").transition().duration(vars.draw.timing).call(shapeStyle, vars);
    } else {
      selection.selectAll("path.d3plus_data").call(shapeStyle, vars);
    }
    size_change = vars.old_height !== vars.height.viz || vars.height.changed || vars.old_width !== vars.width.viz || vars.width.changed;
    vars.old_height = vars.height.viz;
    vars.old_width = vars.width.viz;
    if (vars.coords.changed || size_change || vars.coords.mute.changed || vars.coords.solo.changed || vars.type.changed) {
      vars.zoom.bounds = null;
      vars.zoom.reset = true;
      vars.zoom.coords = {};
      return selection.each(function(d) {
        var areaM, areas, b, c, center, coords, dist_cutoff, dist_values, distances, i, j, largest, len, names, path, ratio, rect, reduced, ref, size, style, test;
        if (d.geometry.coordinates.length > 1) {
          distances = [];
          areas = [];
          areaM = 0;
          test = copy(d);
          largest = copy(d);
          d.geometry.coordinates = d.geometry.coordinates.filter(function(c, i) {
            var a;
            test.geometry.coordinates = [c];
            a = vars.path.area(test);
            if (a > 0) {
              areas.push(a);
              if (a > areaM) {
                largest.geometry.coordinates = [c];
                areaM = a;
              }
              return true;
            } else {
              return false;
            }
          });
          center = vars.path.centroid(largest);
          reduced = copy(d);
          ref = d.geometry.coordinates;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            c = ref[i];
            test.geometry.coordinates = [c];
            distances.push(distance(vars.path.centroid(test), center));
          }
          dist_values = distances.reduce(function(arr, dist, i) {
            if (dist) {
              arr.push(areas[i] / dist);
            }
            return arr;
          }, []);
          dist_cutoff = d3.quantile(dist_values, vars.coords.threshold.value);
          reduced.geometry.coordinates = reduced.geometry.coordinates.filter(function(c, i) {
            var a, dist;
            dist = distances[i];
            a = areas[i];
            return dist === 0 || a / dist > dist_cutoff;
          });
          coords = largest.geometry.coordinates[0];
          if (coords && largest.geometry.type === "MultiPolygon") {
            coords = coords[0];
            largest.geometry.coordinates[0] = coords;
            largest.geometry.type = "Polygon";
          }
        } else {
          reduced = d;
          largest = d;
          coords = d.geometry.coordinates[0];
        }
        vars.zoom.coords[d.d3plus.id] = reduced;
        b = vars.path.bounds(reduced);
        names = fetchText(vars, d);
        delete d.d3plus_label;
        if (coords && names.length) {
          path = path2poly(vars.path(largest));
          style = {
            "font-weight": vars.labels.font.weight,
            "font-family": vars.labels.font.family.value
          };
          ratio = null;
          if (names[0].split(" ").length === 1) {
            size = fontSizes(names[0], style)[0];
            ratio = size.width / size.height;
          }
          rect = largestRect(path, {
            angle: 0,
            aspectRatio: ratio
          });
          if (rect) {
            rect = rect[0];
            d.d3plus_label = {
              anchor: "middle",
              valign: "center",
              h: rect.height,
              w: rect.width,
              x: rect.cx,
              y: rect.cy,
              names: names
            };
          }
        }
        labels[d.id] = d.d3plus_label;
        if (!vars.zoom.bounds) {
          return vars.zoom.bounds = b;
        } else {
          if (vars.zoom.bounds[0][0] > b[0][0]) {
            vars.zoom.bounds[0][0] = b[0][0];
          }
          if (vars.zoom.bounds[0][1] > b[0][1]) {
            vars.zoom.bounds[0][1] = b[0][1];
          }
          if (vars.zoom.bounds[1][0] < b[1][0]) {
            vars.zoom.bounds[1][0] = b[1][0];
          }
          if (vars.zoom.bounds[1][1] < b[1][1]) {
            return vars.zoom.bounds[1][1] = b[1][1];
          }
        }
      });
    } else if (!vars.focus.value.length) {
      vars.zoom.viewport = false;
      return selection.each(function(d) {
        return d.d3plus_label = labels[d.id];
      });
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/coordinates.js.map