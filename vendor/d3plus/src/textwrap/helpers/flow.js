(function() {
  var foreign, tspan;

  foreign = require("./foreign.coffee");

  tspan = require("./tspan.coffee");

  module.exports = function(vars) {
    if (vars.text.html.value) {
      foreign(vars);
    } else {
      tspan(vars);
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/textwrap/helpers/flow.js.map