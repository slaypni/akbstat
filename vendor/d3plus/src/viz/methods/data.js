(function() {
  var process;

  process = require("../../core/methods/process/data.coffee");

  module.exports = {
    accepted: [false, Array, Function, String],
    cache: {},
    delimiter: {
      accepted: [String],
      value: "|"
    },
    donut: {
      size: 0.35
    },
    filetype: {
      accepted: [false, "json", "xml", "html", "csv", "dsv", "tsv", "txt"],
      value: false
    },
    filters: [],
    keys: {},
    mute: [],
    large: 400,
    opacity: 0.9,
    padding: {
      accepted: [Number],
      value: 1
    },
    process: function(value, vars) {
      if (vars.container.id === "default" && value.length) {
        vars.self.container({
          id: "default" + value.length
        });
      }
      return process(value, vars, this);
    },
    solo: [],
    stroke: {
      width: 1
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/data.js.map