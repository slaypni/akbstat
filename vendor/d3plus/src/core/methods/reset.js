(function() {
  var reset, validObject;

  validObject = require("../../object/validate.coffee");

  reset = function(obj, method) {
    var o;
    if (obj.changed) {
      obj.changed = false;
    }
    if (method === "draw") {
      obj.frozen = false;
      obj.update = true;
      obj.first = false;
    }
    for (o in obj) {
      if (o.indexOf("d3plus") < 0 && validObject(obj[o])) {
        reset(obj[o], o);
      }
    }
  };

  module.exports = reset;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/methods/reset.js.map