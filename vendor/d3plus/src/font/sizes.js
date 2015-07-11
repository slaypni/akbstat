(function() {
  var fontTester, getHeight, getWidth;

  fontTester = require("../core/font/tester.coffee");

  module.exports = function(words, style, opts) {
    var attr, sizes, tester, tspans;
    if (!opts) {
      opts = {};
    }
    tester = opts.parent || fontTester("svg").append("text");
    style = style || {};
    sizes = [];
    if (!(words instanceof Array)) {
      words = [words];
    }
    tspans = tester.selectAll("tspan").data(words);
    attr = {
      left: "0px",
      position: "absolute",
      top: "0px",
      x: 0,
      y: 0
    };
    tspans.enter().append("tspan").text(String).style(style).attr(attr).each(function(d) {
      if (typeof opts.mod === "function") {
        return opts.mod(this);
      }
    }).each(function(d) {
      var children, height, width;
      children = d3.select(this).selectAll("tspan");
      if (children.size()) {
        width = [];
        children.each(function() {
          return width.push(getWidth(this));
        });
        width = d3.max(width);
      } else {
        width = getWidth(this);
      }
      height = getHeight(this);
      return sizes.push({
        height: height,
        text: d,
        width: width
      });
    });
    tspans.remove();
    if (!opts.parent) {
      tester.remove();
    }
    return sizes;
  };

  getWidth = function(elem) {
    return elem.getComputedTextLength();
  };

  getHeight = function(elem) {
    return elem.offsetHeight || elem.getBoundingClientRect().height || elem.parentNode.getBBox().height;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/font/sizes.js.map