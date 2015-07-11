(function() {
  var sheet;

  sheet = function(name) {
    var css, i, returnBoolean, tested;
    tested = sheet.tested;
    if (name in tested) {
      return tested[name];
    }
    i = 0;
    returnBoolean = false;
    while (i < document.styleSheets.length) {
      css = document.styleSheets[i];
      if (css.href && css.href.indexOf(name) >= 0) {
        returnBoolean = true;
        break;
      }
      i++;
    }
    return returnBoolean;
  };

  sheet.tested = {};

  module.exports = sheet;

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/client/css.js.map