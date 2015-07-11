(function() {
  var stylesheet;

  stylesheet = require("../../../client/css.coffee");

  module.exports = function(value, vars, method) {
    if (value === false || value.indexOf("fa-") < 0 || (value.indexOf("fa-") === 0 && stylesheet("font-awesome"))) {
      return value;
    } else {
      return method.fallback;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/core/methods/process/icon.js.map