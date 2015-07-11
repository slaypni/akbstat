(function() {
  var copy, update;

  copy = require("../../../util/copy.coffee");

  update = require("../../../array/update.coffee");

  module.exports = function(vars, object, value) {
    if (object.process === Array) {
      return update(copy(object.value), value);
    } else if (typeof object.process === "object" && typeof value === "string") {
      return object.process[value];
    } else if (typeof object.process === "function") {
      return object.process(value, vars, object);
    } else {
      return value;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/core/methods/process/detect.js.map