(function() {
  module.exports = function(id) {
    if (id) {
      d3.selectAll("div#d3plus_tooltip_curtain_" + id).remove();
      return d3.selectAll("div#d3plus_tooltip_id_" + id).remove();
    } else {
      d3.selectAll("div.d3plus_tooltip_curtain").remove();
      return d3.selectAll("div.d3plus_tooltip").remove();
    }
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/tooltip/remove.js.map