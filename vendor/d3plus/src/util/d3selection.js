(function() {
  var ie;

  ie = require("../client/ie.js");

  module.exports = function(elem) {
    if (ie) {
      return typeof elem === "object" && elem instanceof Array && "size" in elem && "select" in elem;
    } else {
      return elem instanceof d3.selection;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/d3selection.js.map