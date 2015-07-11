(function() {
  module.exports = function(arr, x) {
    if (x === void 0) {
      return arr;
    }
    if (x === false) {
      return [];
    }
    if (x instanceof Array) {
      return x;
    }
    if (!(arr instanceof Array)) {
      arr = [];
    }
    if (arr.indexOf(x) >= 0) {
      arr.splice(arr.indexOf(x), 1);
    } else {
      arr.push(x);
    }
    return arr;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/array/update.js.map