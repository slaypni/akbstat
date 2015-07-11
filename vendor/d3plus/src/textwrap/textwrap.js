(function() {
  var attach, print, sizes, text, wrap;

  attach = require("../core/methods/attach.coffee");

  sizes = require("./helpers/parseSize.coffee");

  print = require("../core/console/print.coffee");

  text = require("./helpers/parseText.coffee");

  wrap = require("./helpers/wrap.coffee");

  module.exports = function() {
    var vars;
    vars = {
      self: function(selection) {
        selection.each(function() {
          sizes(vars);
          if (vars.size.value[0] <= vars.height.inner) {
            text(vars);
            wrap(vars);
          } else {
            vars.container.value.html("");
          }
          if (vars.dev.value) {
            print.timeEnd("total draw time");
          }
        });
        return vars.self;
      }
    };
    attach(vars, {
      align: require("./methods/align.coffee"),
      config: require("./methods/config.coffee"),
      container: require("./methods/container.coffee"),
      dev: require("./methods/dev.coffee"),
      draw: require("./methods/draw.coffee"),
      format: require("./methods/format.coffee"),
      height: require("./methods/height.coffee"),
      padding: require("./methods/padding.coffee"),
      resize: require("./methods/resize.coffee"),
      rotate: require("./methods/rotate.coffee"),
      text: require("./methods/text.coffee"),
      shape: require("./methods/shape.coffee"),
      size: require("./methods/size.coffee"),
      valign: require("./methods/valign.coffee"),
      width: require("./methods/width.coffee"),
      x: require("./methods/x.coffee"),
      y: require("./methods/y.coffee")
    });
    return vars.self;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/textwrap/textwrap.js.map