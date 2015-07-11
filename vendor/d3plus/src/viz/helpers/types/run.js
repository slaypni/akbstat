(function() {
  var print;

  print = require("../../../core/console/print.coffee");

  module.exports = function(vars) {
    var app, d, dataRequired, drawable, i, len, ref, requirements, returned, visualization;
    vars.group = vars.g.apps[vars.type.value];
    vars.mouse = {};
    visualization = vars.types[vars.type.value];
    requirements = visualization.requirements || [];
    dataRequired = requirements.indexOf("data") >= 0;
    drawable = !dataRequired || (dataRequired && vars.data.viz.length);
    if (!vars.error.internal && drawable) {
      app = vars.format.locale.value.visualization[vars.type.value];
      if (vars.dev.value) {
        print.time("running " + app);
      }
      ref = vars.data.viz;
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        if (d.d3plus) {
          delete d.d3plus.shape;
          delete d.d3plus.label;
          delete d.d3plus.rotate;
          delete d.d3plus.share;
        }
      }
      returned = visualization(vars);
      if (vars.dev.value) {
        print.timeEnd("running " + app);
      }
    } else {
      returned = null;
    }
    vars.returned = {
      nodes: [],
      edges: null
    };
    if (returned instanceof Array) {
      vars.returned.nodes = returned;
    } else if (returned) {
      if (returned.nodes) {
        vars.returned.nodes = returned.nodes;
      }
      if (returned.edges) {
        vars.returned.edges = returned.edges;
      }
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/viz/helpers/types/run.js.map