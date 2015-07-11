(function() {
  module.exports = function(arr, value) {
    var closest;
    closest = arr[0];
    arr.forEach(function(p) {
      if (Math.abs(value - p) < Math.abs(value - closest)) {
        return closest = p;
      }
    });
    return closest;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/closest.js.map