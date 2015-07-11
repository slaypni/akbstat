(function() {
  var filter;

  filter = require("../../core/methods/filter.coffee");

  module.exports = {
    accepted: [false, String],
    nesting: true,
    mute: filter(true),
    solo: filter(true),
    secondary: {
      accepted: [false, String],
      nesting: true,
      value: false
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/text.js.map