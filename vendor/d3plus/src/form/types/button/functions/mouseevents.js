(function() {
  module.exports = function(elem, vars, color) {
    var events, ie;
    color = require("./color.coffee");
    events = require("../../../../client/pointer.coffee");
    ie = require("../../../../client/ie.js");
    return elem.on(events.over, function(d, i) {
      vars.self.hover(d[vars.id.value]);
      if (ie || !vars.draw.timing) {
        return d3.select(this).style("cursor", "pointer").call(color, vars);
      } else {
        return d3.select(this).style("cursor", "pointer").transition().duration(vars.timing.mouseevents).call(color, vars);
      }
    }).on(events.out, function(d) {
      vars.self.hover(false);
      if (ie || !vars.draw.timing) {
        return d3.select(this).style("cursor", "auto").call(color, vars);
      } else {
        return d3.select(this).style("cursor", "auto").transition().duration(vars.timing.mouseevents).call(color, vars);
      }
    }).on(events.click, function(d) {
      return vars.self.focus(d[vars.id.value]).draw();
    });
  };

}).call(this);

//# sourceMappingURL=../../../../../../../_sourcemaps/vendor/d3plus/src/form/types/button/functions/mouseevents.js.map