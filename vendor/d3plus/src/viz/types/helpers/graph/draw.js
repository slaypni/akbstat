(function() {
  var axes, draw, mouse, plot;

  axes = require("./includes/axes.coffee");

  draw = require("./includes/svg.coffee");

  mouse = require("./includes/mouse.coffee");

  plot = require("./includes/plot.coffee");

  module.exports = function(vars, opts) {
    if (opts === void 0) {
      opts = {};
    }
    axes(vars, opts);
    plot(vars, opts);
    draw(vars, opts);
    vars.mouse = opts.mouse === true ? mouse : false;
  };

}).call(this);

//# sourceMappingURL=../../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/helpers/graph/draw.js.map