(function() {
  var formatNumber, locale, mergeObject, titleCase;

  formatNumber = require("../../number/format.coffee");

  locale = require("../../core/locale/locale.coffee");

  mergeObject = require("../../object/merge.coffee");

  titleCase = require("../../string/title.coffee");

  module.exports = {
    accepted: [Function, String],
    affixes: {
      accepted: [Object],
      objectAccess: false,
      value: {}
    },
    deprecates: ["number_format", "text_format"],
    locale: {
      accepted: function() {
        return d3.keys(locale);
      },
      process: function(value) {
        var defaultLocale, returnObject;
        defaultLocale = "en_US";
        returnObject = locale[defaultLocale];
        if (value !== defaultLocale) {
          returnObject = mergeObject(returnObject, locale[value]);
        }
        this.language = value;
        return returnObject;
      },
      value: "en_US"
    },
    number: {
      accepted: [false, Function],
      value: false
    },
    process: function(value, vars) {
      if (typeof value === "string") {
        vars.self.format({
          locale: value
        });
      } else {
        if (typeof value === "function") {
          return value;
        }
      }
      return this.value;
    },
    text: {
      accepted: [false, Function],
      value: false
    },
    value: function(value, opts) {
      var f, v, vars;
      if (!opts) {
        opts = {};
      }
      vars = opts.vars || {};
      if (vars.time && vars.time.value && opts.key === vars.time.value) {
        v = value.constructor === Date ? value : new Date(value);
        return vars.data.time.format(v);
      } else if (typeof value === "number") {
        f = this.number.value || formatNumber;
        return f(value, opts);
      } else if (typeof value === "string") {
        f = this.text.value || titleCase;
        return f(value, opts);
      } else {
        return JSON.stringify(value);
      }
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/format.js.map