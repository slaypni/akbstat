(function() {
  module.exports = function(vars) {
    var text;
    if (!vars.text.value) {
      text = vars.container.value.text();
      if (text) {
        if (text.indexOf("tspan") >= 0) {
          text.replace(/\<\/tspan\>\<tspan\>/g, " ");
          text.replace(/\<\/tspan\>/g, "");
          text.replace(/\<tspan\>/g, "");
        }
        text = text.replace(/(\r\n|\n|\r)/gm, "");
        text = text.replace(/^\s+|\s+$/g, "");
        vars.self.text(text);
      }
    }
    if (vars.text.value instanceof Array) {
      vars.text.phrases = vars.text.value.filter(function(t) {
        return ["string", "number"].indexOf(typeof t) >= 0;
      });
    } else {
      vars.text.phrases = [vars.text.value + ""];
    }
    if (!vars.align.value) {
      return vars.container.align = vars.container.value.style("text-anchor") || vars.container.value.attr("text-anchor");
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/textwrap/helpers/parseText.js.map