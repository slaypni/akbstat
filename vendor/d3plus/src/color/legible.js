(function() {
  module.exports = function(color) {
    var hsl;
    hsl = d3.hsl(color);
    if (hsl.l > .45) {
      if (hsl.s > .8) {
        hsl.s = 0.8;
      }
      hsl.l = 0.45;
    }
    return hsl.toString();
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/color/legible.js.map