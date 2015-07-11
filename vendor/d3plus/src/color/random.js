(function() {
  var defaultScale;

  defaultScale = require("./scale.coffee");

  module.exports = function(x, scale) {
    var rand_int;
    rand_int = x || Math.floor(Math.random() * 20);
    scale = scale || defaultScale;
    return scale(rand_int);
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/color/random.js.map