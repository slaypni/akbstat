(function() {
  var fetchValue, getColor, getRandom, randomColor, uniques, validColor, validObject;

  fetchValue = require("./value.coffee");

  randomColor = require("../../color/random.coffee");

  validColor = require("../../color/validate.coffee");

  validObject = require("../../object/validate.coffee");

  uniques = require("../../util/uniques.coffee");

  module.exports = function(vars, id, level) {
    var color, colorLevel, colors, i, obj, value;
    obj = validObject(id);
    if (obj && "d3plus" in id && "color" in id.d3plus) {
      return id.d3plus.color;
    }
    if (level === void 0) {
      level = vars.id.value;
    }
    if (typeof level === "number") {
      level = vars.id.nesting[level];
    }
    if (!vars.color.value) {
      return getRandom(vars, id, level);
    } else {
      colors = [];
      i = vars.id.nesting.indexOf(level);
      while (i >= 0) {
        colorLevel = vars.id.nesting[i];
        value = uniques(id, vars.color.value, fetchValue, vars, colorLevel);
        if (value.length === 1) {
          value = value[0];
        }
        if (!(value instanceof Array) && value !== void 0 && value !== null) {
          color = getColor(vars, id, value, level);
          if (colors.indexOf(color) < 0) {
            colors.push(color);
          }
          break;
        }
        i--;
      }
      if (colors.length === 1) {
        return colors[0];
      } else {
        return vars.color.missing;
      }
    }
  };

  getColor = function(vars, id, color, level) {
    if (!color) {
      if (vars.color.value && typeof vars.color.valueScale === "function") {
        return vars.color.valueScale(0);
      }
      return getRandom(vars, id, level);
    } else if (!vars.color.valueScale) {
      if (validColor(color)) {
        return color;
      } else {
        return getRandom(vars, color, level);
      }
    } else {
      return vars.color.valueScale(color);
    }
  };

  getRandom = function(vars, c, level) {
    if (validObject(c)) {
      c = fetchValue(vars, c, level);
    }
    if (c instanceof Array) {
      c = c[0];
    }
    return randomColor(c, vars.color.scale.value);
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/fetch/color.js.map