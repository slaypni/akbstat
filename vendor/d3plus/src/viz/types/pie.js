(function() {
  var comparator, dataThreshold, fetchValue, groupData, order, pie;

  comparator = require("../../array/comparator.coffee");

  dataThreshold = require("../../core/data/threshold.js");

  fetchValue = require("../../core/fetch/value.coffee");

  groupData = require("../../core/data/group.coffee");

  order = {};

  pie = function(vars) {
    var d, groupedData, i, item, len, pieData, pieLayout, radius, returnData;
    pieLayout = d3.layout.pie().value(function(d) {
      return d.value;
    }).sort(function(a, b) {
      var aID, bID;
      if (vars.order.value) {
        return comparator(a.d3plus, b.d3plus, [vars.order.value], vars.order.sort.value, [], vars);
      } else {
        aID = fetchValue(vars, a.d3plus, vars.id.value);
        if (order[aID] === void 0) {
          order[aID] = a.value;
        }
        bID = fetchValue(vars, b.d3plus, vars.id.value);
        if (order[bID] === void 0) {
          order[bID] = b.value;
        }
        if (order[bID] < order[aID]) {
          return -1;
        } else {
          return 1;
        }
      }
    });
    groupedData = groupData(vars, vars.data.viz, []);
    pieData = pieLayout(groupedData);
    returnData = [];
    radius = d3.min([vars.width.viz, vars.height.viz]) / 2 - vars.labels.padding * 2;
    for (i = 0, len = pieData.length; i < len; i++) {
      d = pieData[i];
      item = d.data.d3plus;
      item.d3plus.startAngle = d.startAngle;
      item.d3plus.endAngle = d.endAngle;
      item.d3plus.r = radius;
      item.d3plus.x = vars.width.viz / 2;
      item.d3plus.y = vars.height.viz / 2;
      returnData.push(item);
    }
    return returnData;
  };

  pie.filter = dataThreshold;

  pie.requirements = ["data", "size"];

  pie.shapes = ["arc"];

  pie.threshold = function(vars) {
    return (40 * 40) / (vars.width.viz * vars.height.viz);
  };

  module.exports = pie;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/pie.js.map