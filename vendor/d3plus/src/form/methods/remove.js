(function() {
  module.exports = {
    accepted: void 0,
    process: function(value, vars) {
      if (this.initialized) {
        vars.container.value.remove();
      }
    },
    value: void 0
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/remove.js.map