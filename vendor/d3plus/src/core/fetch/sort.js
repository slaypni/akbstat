(function() {
  var fetchColor, fetchText, fetchValue;

  fetchValue = require("./value.coffee");

  fetchColor = require("./color.coffee");

  fetchText = require("./text.js");

  module.exports = function(vars, d, keys, colors, depth) {
    var i, key, len, obj, value;
    if (!(keys instanceof Array)) {
      keys = [keys];
    }
    if (!(colors instanceof Array)) {
      colors = [colors];
    }
    if (vars && depth !== void 0 && typeof depth !== "number") {
      depth = vars.id.nesting.indexOf(depth);
    }
    obj = {};
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (vars) {
        if (colors.indexOf(key) >= 0) {
          value = fetchColor(vars, d, depth);
        } else if (key === vars.text.value) {
          value = fetchText(vars, d, depth);
        } else {
          value = fetchValue(vars, d, key, depth);
        }
      } else {
        value = d[key];
      }
      if (value instanceof Array) {
        value = value[0];
      }
      value = typeof value === "string" ? value.toLowerCase() : value;
      obj[key] = value;
    }
    return obj;
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/fetch/sort.js.map