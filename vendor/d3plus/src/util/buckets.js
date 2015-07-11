(function() {
  module.exports = function(arr, n) {
    var buckets, step;
    buckets = [];
    step = 1 / (n - 1) * (arr[1] - arr[0]);
    return d3.range(arr[0], arr[1] + step, step);
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/buckets.js.map