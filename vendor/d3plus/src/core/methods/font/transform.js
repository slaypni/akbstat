(function() {
  module.exports = function(transform) {
    var accepted;
    accepted = ["capitalize", "lowercase", "none", "uppercase"];
    if (transform === false) {
      accepted.unshift(false);
    }
    if (accepted.indexOf(transform) < 0) {
      transform = "none";
    }
    return {
      accepted: accepted,
      value: transform
    };
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/core/methods/font/transform.js.map