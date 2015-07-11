(function() {
  var colorSort;

  colorSort = require("../color/sort.coffee");

  module.exports = function(a, b, keys, sort, colors, vars, depth) {
    var i, k, retVal;
    if (!sort) {
      sort = "asc";
    }
    if (!(colors instanceof Array)) {
      colors = [colors];
    }
    if (!(keys instanceof Array)) {
      keys = [keys];
    }
    if (vars && depth !== void 0 && typeof depth !== "number") {
      depth = vars.id.nesting.indexOf(depth);
    }
    retVal = 0;
    i = 0;
    while (i < keys.length) {
      k = keys[i];
      a = vars && a.d3plus && a.d3plus.sortKeys ? a.d3plus.sortKeys[k] : a[k];
      b = vars && b.d3plus && b.d3plus.sortKeys ? b.d3plus.sortKeys[k] : b[k];
      if (vars && colors.indexOf(k) >= 0) {
        retVal = colorSort(a, b);
      } else {
        retVal = a < b ? -1 : 1;
      }
      if (retVal !== 0 || i === keys.length - 1) {
        break;
      }
      i++;
    }
    if (sort === "asc") {
      return retVal;
    } else {
      return -retVal;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/array/comparator.js.map