(function() {
  module.exports = {
    accepted: [Boolean, Function, String],
    agg: {
      accepted: [false, Function, "sum", "min", "max", "mean", "median"],
      value: false
    },
    deprecates: ["sort"],
    sort: {
      accepted: ["asc", "desc"],
      value: "desc"
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/order.js.map