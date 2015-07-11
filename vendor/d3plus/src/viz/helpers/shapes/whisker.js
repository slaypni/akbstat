(function() {
  module.exports = function(vars, selection, enter, exit) {
    var d, data, init, marker, orient, pos, position, size, style;
    data = function(d) {
      if (d.d3plus.text) {
        d.d3plus_label = {
          w: size,
          h: size,
          x: 0,
          y: 0,
          background: "#fff",
          resize: false,
          angle: ["left", "right"].indexOf(d.d3plus.position) >= 0 ? 90 : 0
        };
      } else if (d.d3plus.label) {
        d.d3plus_label = d.d3plus.label;
      } else {
        delete d.d3plus_label;
      }
      return [d];
    };
    style = function(line) {
      return line.style("stroke-width", vars.data.stroke.width).style("stroke", "#444").attr("fill", "none").attr("shape-rendering", vars.shape.rendering.value);
    };
    init = function(line) {
      return line.attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
    };
    position = function(line) {
      return line.attr("x1", function(d) {
        var offset, w, x;
        if (["top", "bottom"].indexOf(d.d3plus.position) >= 0) {
          return 0;
        } else {
          offset = d.d3plus.offset || 0;
          w = d.d3plus.width || 0;
          x = offset < 0 ? -w : w;
          return x + offset;
        }
      }).attr("x2", function(d) {
        if (["top", "bottom"].indexOf(d.d3plus.position) >= 0) {
          return 0;
        } else {
          return d.d3plus.offset || 0;
        }
      }).attr("y1", function(d) {
        var h, offset, y;
        if (["left", "right"].indexOf(d.d3plus.position) >= 0) {
          return 0;
        } else {
          offset = d.d3plus.offset || 0;
          h = d.d3plus.height || 0;
          y = offset < 0 ? -h : h;
          return y + offset;
        }
      }).attr("y2", function(d) {
        if (["left", "right"].indexOf(d.d3plus.position) >= 0) {
          return 0;
        } else {
          return d.d3plus.offset || 0;
        }
      }).attr("marker-start", "url(#d3plus_whisker_marker)");
    };
    marker = vars.defs.selectAll("#d3plus_whisker_marker").data([0]);
    marker.enter().append("marker").attr("id", "d3plus_whisker_marker").attr("markerUnits", "userSpaceOnUse").style("overflow", "visible").append("line");
    d = selection.datum();
    if (d) {
      pos = d.d3plus.position;
      orient = ["top", "bottom"].indexOf(pos) >= 0 ? "horizontal" : "vertical";
      size = orient === "horizontal" ? d.d3plus.width : d.d3plus.height;
    } else {
      orient = "horizontal";
      size = 0;
    }
    marker.select("line").attr("x1", orient === "horizontal" ? -size / 2 : 0).attr("x2", orient === "horizontal" ? size / 2 : 0).attr("y1", orient === "vertical" ? -size / 2 : 0).attr("y2", orient === "vertical" ? size / 2 : 0).call(style).style("stroke-width", vars.data.stroke.width * 2);
    if (vars.draw.timing) {
      enter.append("line").attr("class", "d3plus_data").call(style).call(init);
      selection.selectAll("line.d3plus_data").data(data).transition().duration(vars.draw.timing).call(style).call(position);
      exit.selectAll("line.d3plus_data").transition().duration(vars.draw.timing).call(init);
    } else {
      enter.append("line").attr("class", "d3plus_data");
      selection.selectAll("line.d3plus_data").data(data).call(style).call(position);
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/whisker.js.map