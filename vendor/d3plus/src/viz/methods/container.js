(function() {
  var d3selection;

  d3selection = require("../../util/d3selection.coffee");

  module.exports = {
    accepted: [false, Array, Object, String],
    id: "default",
    process: function(value) {
      if (value === false) {
        return false;
      } else if (d3selection(value)) {
        return value;
      } else if (value instanceof Array) {
        return d3.select(value[0][0]);
      } else {
        return d3.select(value);
      }
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/container.js.map