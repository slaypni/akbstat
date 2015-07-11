(function() {
  var dataThreshold, groupData, mergeObject, tree_map;

  dataThreshold = require("../../core/data/threshold.js");

  groupData = require("../../core/data/group.coffee");

  mergeObject = require("../../object/merge.coffee");

  tree_map = function(vars) {
    var d, data, groupedData, i, len, returnData, root;
    groupedData = groupData(vars, vars.data.viz);
    data = d3.layout.treemap().mode(vars.type.mode.value).round(true).size([vars.width.viz, vars.height.viz]).children(function(d) {
      return d.values;
    }).padding(vars.data.padding.value).sort(function(a, b) {
      var sizeDiff;
      sizeDiff = a.value - b.value;
      if (sizeDiff === 0) {
        return a.id < b.id;
      } else {
        return sizeDiff;
      }
    }).nodes({
      name: "root",
      values: groupedData
    }).filter(function(d) {
      return !d.values && d.area;
    });
    if (data.length) {
      root = data[0];
      while (root.parent) {
        root = root.parent;
      }
      returnData = [];
      for (i = 0, len = data.length; i < len; i++) {
        d = data[i];
        d.d3plus.d3plus = mergeObject(d.d3plus.d3plus, {
          x: d.x + d.dx / 2,
          y: d.y + d.dy / 2,
          width: d.dx,
          height: d.dy,
          share: d.value / root.value
        });
        returnData.push(d.d3plus);
      }
    }
    return returnData;
  };

  tree_map.filter = dataThreshold;

  tree_map.modes = ["squarify", "slice", "dice", "slice-dice"];

  tree_map.requirements = ["data", "size"];

  tree_map.shapes = ["square"];

  tree_map.threshold = function(vars) {
    return (40 * 40) / (vars.width.viz * vars.height.viz);
  };

  module.exports = tree_map;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/tree_map.js.map