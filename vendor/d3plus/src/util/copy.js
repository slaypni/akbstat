(function() {
  var copy, objectMerge, objectValidate;

  objectMerge = require("../object/merge.coffee");

  objectValidate = require("../object/validate.coffee");

  copy = function(variable) {
    var ret;
    if (objectValidate(variable)) {
      return objectMerge(variable);
    } else if (variable instanceof Array) {
      ret = [];
      variable.forEach(function(o) {
        return ret.push(copy(o));
      });
      return ret;
    } else {
      return variable;
    }
  };

  module.exports = copy;

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/copy.js.map