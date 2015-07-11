(function() {
  module.exports = function(points) {
    var mad, median, result;
    median = d3.median(points);
    mad = d3.median(points.map(function(p) {
      return Math.abs(p - median);
    }));
    result = points.map(function(p, i) {
      return [i, Math.abs(p - median) / mad];
    });
    return result.sort(function(a, b) {
      return b[1] - a[1];
    });
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/data/mad.js.map