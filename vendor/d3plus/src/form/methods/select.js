(function() {
  module.exports = {
    accepted: [String],
    chainable: false,
    process: function(value, vars) {
      var container;
      container = vars.container.value;
      if (container && value) {
        return container.select(value);
      } else {
        return value;
      }
    },
    value: void 0
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/select.js.map