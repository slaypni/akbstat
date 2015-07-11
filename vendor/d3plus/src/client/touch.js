(function() {
  module.exports = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch ? true : false;

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/client/touch.js.map