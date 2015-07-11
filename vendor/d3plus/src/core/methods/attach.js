(function() {
  var checkObject, copy, createFunction, initialize, print, process, setMethod, stringFormat, validObject;

  copy = require("../../util/copy.coffee");

  print = require("../console/print.coffee");

  process = require("./process/detect.coffee");

  setMethod = require("./set.coffee");

  stringFormat = require("../../string/format.js");

  validObject = require("../../object/validate.coffee");

  module.exports = function(vars, methods) {
    var method, obj, results;
    results = [];
    for (method in methods) {
      obj = methods[method];
      vars[method] = copy(obj);
      vars[method].initialized = initialize(vars, vars[method], method);
      results.push(vars.self[method] = createFunction(vars, method));
    }
    return results;
  };

  initialize = function(vars, obj, method) {
    var d, deps, i, len, o;
    obj.previous = false;
    obj.changed = false;
    obj.initialized = false;
    if ("init" in obj && (!("value" in obj))) {
      obj.value = obj.init(vars);
      delete obj.init;
    }
    if ("process" in obj) {
      obj.value = process(vars, obj, obj.value);
    }
    for (o in obj) {
      if (o === "deprecates") {
        deps = obj[o] instanceof Array ? obj[o] : [obj[o]];
        for (i = 0, len = deps.length; i < len; i++) {
          d = deps[i];
          vars.self[d] = (function(dep, n) {
            return function(x) {
              var str;
              str = vars.format.locale.value.dev.deprecated;
              dep = "." + dep + "()";
              print.error(stringFormat(str, dep, "." + n + "()"), n);
              return vars.self;
            };
          })(d, method);
        }
      } else if (o === "global") {
        if (!(method in vars)) {
          vars[method] = [];
        }
      } else if (o !== "value") {
        if (validObject(obj[o])) {
          initialize(vars, obj[o], o);
        }
      }
    }
    return true;
  };

  createFunction = function(vars, key) {
    return function(user, callback) {
      var accepted, checkFont, checkValue, fontAttr, fontAttrValue, s, starting, str;
      accepted = "accepted" in vars[key] ? vars[key].accepted : null;
      if (typeof accepted === "function") {
        accepted = accepted(vars);
      }
      if (!(accepted instanceof Array)) {
        accepted = [accepted];
      }
      if (user === Object) {
        return vars[key];
      } else if (!arguments.length && accepted.indexOf(void 0) < 0) {
        if ("value" in vars[key]) {
          return vars[key].value;
        } else {
          return vars[key];
        }
      }
      if (key === "style" && typeof user === "object") {
        str = vars.format.locale.value.dev.oldStyle;
        for (s in user) {
          print.warning(stringFormat(str, "\"" + s + "\"", s), s);
          vars.self[s](user[s]);
        }
      }
      if (key === "font") {
        if (typeof user === "string") {
          user = {
            family: user
          };
        }
        starting = true;
        checkValue = function(o, a, m, v) {
          if (validObject(o[m]) && a in o[m]) {
            if (validObject(o[m][a])) {
              if (o[m][a].process) {
                o[m][a].value = o[m][a].process(v);
              } else {
                o[m][a].value = v;
              }
            } else {
              o[m][a] = v;
            }
          }
        };
        checkFont = function(o, a, v) {
          var m;
          if (validObject(o)) {
            if (starting) {
              for (m in o) {
                checkValue(o, a, m, v);
              }
            } else if ("font" in o) {
              checkValue(o, a, "font", v);
            }
            starting = false;
            for (m in o) {
              checkFont(o[m], a, v);
            }
          }
        };
        for (fontAttr in user) {
          fontAttrValue = user[fontAttr];
          if (fontAttr !== "secondary") {
            if (validObject(fontAttrValue)) {
              fontAttrValue = fontAttrValue.value;
            }
            if (fontAttrValue) {
              checkFont(vars, fontAttr, fontAttrValue);
            }
          }
        }
      }
      checkObject(vars, key, vars, key, user);
      if (typeof callback === "function") {
        vars[key].callback = callback;
      }
      if (vars[key].chainable === false) {
        return vars[key].value;
      } else {
        return vars.self;
      }
    };
  };

  checkObject = function(vars, method, object, key, value) {
    var approvedObject, d, objectOnly, passingObject;
    if (["accepted", "changed", "initialized", "previous", "process"].indexOf(key) < 0) {
      passingObject = validObject(value);
      objectOnly = validObject(object[key]) && "objectAccess" in object[key] && object[key]["objectAccess"] === false;
      approvedObject = passingObject && (objectOnly || ((!("value" in value)) && (!(d3.keys(value)[0] in object[key]))));
      if (value === null || !passingObject || approvedObject) {
        setMethod(vars, method, object, key, value);
      } else if (passingObject) {
        for (d in value) {
          checkObject(vars, method, object[key], d, value[d]);
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/core/methods/attach.js.map