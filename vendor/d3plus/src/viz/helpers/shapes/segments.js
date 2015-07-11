(function() {
  var fetchValue;

  fetchValue = require("../../../core/fetch/value.coffee");

  module.exports = function(vars, d, segment) {
    var ret;
    ret = vars[segment].value;
    if (ret) {
      if (segment in d.d3plus) {
        return d.d3plus[segment];
      } else {
        return fetchValue(vars, d, ret);
      }
    } else {
      return d.d3plus[segment];
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/shapes/segments.js.map