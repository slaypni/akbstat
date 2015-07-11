(function() {
  module.exports = {
    accepted: [Object],
    objectAccess: false,
    process: function(value, vars) {
      var method, setting;
      for (method in value) {
        setting = value[method];
        if (method in vars.self) {
          vars.self[method](setting);
        }
      }
      return value;
    },
    value: {}
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/config.js.map