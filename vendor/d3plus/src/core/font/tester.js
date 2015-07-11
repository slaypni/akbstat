(function() {
  module.exports = function(type) {
    var attrs, styles, tester;
    if (["div", "svg"].indexOf(type) < 0) {
      type = "div";
    }
    styles = {
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      visibility: "hidden",
      display: "block"
    };
    attrs = type === "div" ? {} : {
      position: "absolute"
    };
    tester = d3.select("body").selectAll(type + ".d3plus_tester").data([0]);
    tester.enter().append(type).attr("class", "d3plus_tester").style(styles).attr(attrs);
    return tester;
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/font/tester.js.map