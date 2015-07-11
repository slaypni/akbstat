(function() {
  var ie, touch;

  ie = require("./ie.js");

  touch = require("./touch.coffee");

  if (touch) {
    module.exports = {
      click: "click",
      down: "touchstart",
      up: "touchend",
      over: "touchstart",
      out: "touchend",
      move: "touchmove"
    };
  } else {
    module.exports = {
      click: "click",
      down: "mousedown",
      up: "mouseup",
      over: ie ? "mouseenter" : "mouseover",
      out: ie ? "mouseleave" : "mouseout",
      move: "mousemove"
    };
  }

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/client/pointer.js.map