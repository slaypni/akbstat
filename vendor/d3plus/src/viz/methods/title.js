(function() {
  var decoration, family, stringStrip, transform;

  decoration = require("../../core/methods/font/decoration.coffee");

  family = require("../../core/methods/font/family.coffee");

  transform = require("../../core/methods/font/transform.coffee");

  stringStrip = require("../../string/strip.js");

  module.exports = {
    accepted: [false, Function, String],
    font: {
      align: "center",
      color: "#444444",
      decoration: decoration(),
      family: family(),
      size: 16,
      transform: transform(),
      weight: 400
    },
    height: false,
    link: false,
    padding: 2,
    position: "top",
    process: function(value, vars) {
      var id;
      if (vars.container.id.indexOf("default") === 0 && value) {
        id = stringStrip(value).toLowerCase();
        vars.self.container({
          id: id
        });
      }
      return value;
    },
    sub: {
      accepted: [false, Function, String],
      deprecates: "sub_title",
      font: {
        align: "center",
        color: "#444444",
        decoration: decoration(),
        family: family(),
        size: 12,
        transform: transform(),
        weight: 200
      },
      link: false,
      padding: 1,
      position: "top",
      value: false
    },
    total: {
      accepted: [Boolean, Object],
      deprecates: "total_bar",
      font: {
        align: "center",
        color: "#444444",
        decoration: decoration(),
        family: family(),
        size: 12,
        transform: transform(),
        weight: 200,
        value: false
      },
      link: false,
      padding: 1,
      position: "top",
      value: false
    },
    width: false,
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/title.js.map