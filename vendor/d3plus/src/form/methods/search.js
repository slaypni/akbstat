(function() {
  module.exports = {
    accepted: ["auto", Boolean],
    process: function(value) {
      if (typeof value === "Boolean") {
        this.enabled = value;
      }
      return value;
    },
    term: "",
    value: "auto"
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/search.js.map