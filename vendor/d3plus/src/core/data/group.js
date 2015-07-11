(function() {
  var fetchValue;

  fetchValue = require("../fetch/value.coffee");

  module.exports = function(vars, data, nesting) {
    var d, groupedData, i, j, k, len, len1, n, strippedData, val;
    groupedData = d3.nest();
    if (vars.id.grouping.value) {
      if (nesting === void 0) {
        nesting = vars.id.nesting;
      }
      for (i = j = 0, len = nesting.length; j < len; i = ++j) {
        n = nesting[i];
        if (i < vars.depth.value) {
          (function(n) {
            return groupedData.key(function(d) {
              return fetchValue(vars, d.d3plus, n);
            });
          })(n);
        }
      }
    }
    strippedData = [];
    for (k = 0, len1 = data.length; k < len1; k++) {
      d = data[k];
      val = vars.size.value ? fetchValue(vars, d, vars.size.value) : 1;
      if (val && typeof val === "number" && val > 0) {
        delete d.d3plus.r;
        delete d.d3plus.x;
        delete d.d3plus.y;
        strippedData.push({
          d3plus: d,
          id: d[vars.id.value],
          value: val
        });
      }
    }
    return groupedData.entries(strippedData);
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/data/group.js.map