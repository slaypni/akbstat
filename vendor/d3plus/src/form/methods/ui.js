(function() {
  var align, decoration, family, margin, transform;

  family = require("../../core/methods/font/family.coffee");

  align = require("../../core/methods/font/align.coffee");

  decoration = require("../../core/methods/font/decoration.coffee");

  margin = require("../../core/methods/process/margin.coffee");

  transform = require("../../core/methods/font/transform.coffee");

  module.exports = {
    align: align("center"),
    border: 1,
    color: {
      primary: {
        process: function(value, vars) {
          var primary;
          primary = this.value;
          if (!vars.ui.color.secondary.value) {
            vars.ui.color.secondary.value = d3.rgb(primary).darker(0.75).toString();
          }
          return value;
        },
        value: "#ffffff"
      },
      secondary: {
        value: false
      }
    },
    display: {
      acceped: ["block", "inline-block"],
      value: "inline-block"
    },
    font: {
      align: align("center"),
      color: "#444",
      decoration: decoration(),
      family: family(),
      size: 11,
      transform: transform(),
      weight: 200
    },
    margin: {
      process: function(value) {
        var userValue;
        if (value === void 0) {
          value = this.value;
        }
        userValue = value;
        margin(value, this);
        return userValue;
      },
      value: 5
    },
    padding: {
      process: function(value) {
        var userValue;
        if (value === void 0) {
          value = this.value;
        }
        userValue = value;
        margin(value, this);
        return userValue;
      },
      value: 5
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/ui.js.map