(function() {
  module.exports = {
    accepted: [false, Array, Function, Number, String],
    deprecates: "highlight",
    process: function(value) {
      if (value === false) {
        return [];
      } else if (value instanceof Array) {
        return value;
      } else {
        return [value];
      }
    },
    tooltip: {
      accepted: [Boolean],
      value: true
    },
    value: []
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/focus.js.map