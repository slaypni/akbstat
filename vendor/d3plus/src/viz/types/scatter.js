(function() {
  var fetchValue, graph, print, scatter, sort, ticks;

  fetchValue = require("../../core/fetch/value.coffee");

  graph = require("./helpers/graph/draw.coffee");

  print = require("../../core/console/print.coffee");

  sort = require("../../array/sort.coffee");

  ticks = require("./helpers/graph/dataTicks.coffee");

  scatter = function(vars) {
    var d, domains, i, len, ref;
    graph(vars, {
      buffer: "size",
      mouse: true
    });
    domains = vars.x.domain.viz.concat(vars.y.domain.viz);
    if (domains.indexOf(void 0) >= 0) {
      return [];
    }
    ref = vars.data.viz;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      d.d3plus.x = vars.x.scale.viz(fetchValue(vars, d, vars.x.value));
      d.d3plus.x += vars.axes.margin.left;
      d.d3plus.y = vars.y.scale.viz(fetchValue(vars, d, vars.y.value));
      d.d3plus.y += vars.axes.margin.top;
      if (typeof vars.size.value === "number" || !vars.size.value) {
        d.d3plus.r = vars.axes.scale(0);
      } else {
        d.d3plus.r = vars.axes.scale(fetchValue(vars, d, vars.size.value));
      }
    }
    ticks(vars);
    return sort(vars.data.viz, vars.order.value || vars.size.value || vars.id.value, vars.order.sort.value === "desc" ? "asc" : "desc", vars.color.value || [], vars);
  };

  scatter.fill = true;

  scatter.requirements = ["data", "x", "y"];

  scatter.scale = 1.1;

  scatter.setup = function(vars) {
    if (vars.time.value && !vars.axes.discrete) {
      if (vars.time.value === vars.x.value) {
        vars.self.x({
          scale: "discrete"
        });
      }
      if (vars.time.value === vars.y.value) {
        return vars.self.y({
          scale: "discrete"
        });
      }
    }
  };

  scatter.shapes = ["circle", "square", "donut"];

  scatter.tooltip = "static";

  module.exports = scatter;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/scatter.js.map