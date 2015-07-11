(function() {
  module.exports = function(rendering) {
    var accepted;
    accepted = ["auto", "optimizeSpeed", "crispEdges", "geometricPrecision"];
    if (!(accepted.indexOf(rendering) >= 0)) {
      rendering = "crispEdges";
    }
    return {
      accepted: accepted,
      value: rendering
    };
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/methods/rendering.js.map