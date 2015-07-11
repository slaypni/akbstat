(function() {
  var decoration, family, transform;

  decoration = require("../../core/methods/font/decoration.coffee");

  family = require("../../core/methods/font/family.coffee");

  transform = require("../../core/methods/font/transform.coffee");

  module.exports = {
    accepted: [Boolean],
    align: {
      accepted: ["start", "middle", "end", "left", "center", "right"],
      process: function(value) {
        var css;
        css = ["left", "center", "right"].indexOf(value);
        if (css >= 0) {
          value = this.accepted[css];
        }
        return value;
      },
      value: "middle"
    },
    font: {
      decoration: decoration(),
      family: family(),
      size: 11,
      transform: transform(),
      weight: 200
    },
    padding: 7,
    resize: {
      accepted: [Boolean],
      value: true
    },
    text: {
      accepted: [false, Function, String],
      value: false
    },
    segments: 2,
    valign: {
      accepted: [false, "top", "middle", "bottom"],
      value: "middle"
    },
    value: true
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/labels.js.map