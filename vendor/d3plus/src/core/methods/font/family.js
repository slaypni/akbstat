(function() {
  var helvetica, validate;

  validate = require("../../../font/validate.coffee");

  helvetica = ["Helvetica Neue", "HelveticaNeue", "Helvetica", "Arial", "sans-serif"];

  module.exports = function(family) {
    if (family === void 0) {
      family = helvetica;
    }
    return {
      process: validate,
      value: family
    };
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/core/methods/font/family.js.map