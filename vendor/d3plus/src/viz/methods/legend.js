(function() {
  var family;

  family = require("../../core/methods/font/family.coffee");

  module.exports = {
    accepted: [Boolean],
    align: "middle",
    filters: {
      accepted: [Boolean],
      value: false
    },
    font: {
      align: "middle",
      color: "#444444",
      family: family(),
      size: 10,
      weight: 200
    },
    gradient: {
      height: 10
    },
    icons: {
      accepted: [Boolean],
      value: true
    },
    order: {
      accepted: ["color", "id", "size", "text"],
      sort: {
        accepted: ["asc", "desc"],
        value: "asc"
      },
      value: "color"
    },
    size: [8, 30],
    tooltip: {
      accepted: [Boolean],
      value: true
    },
    text: {
      accepted: [false, Function, String],
      value: false
    },
    value: true
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/legend.js.map