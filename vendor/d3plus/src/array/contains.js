(function() {
  module.exports = function(arr, value) {
    var constructor;
    if (arr instanceof Array) {
      constructor = value === void 0 || value === null ? value : value.constructor;
      return arr.indexOf(value) >= 0 || arr.indexOf(constructor) >= 0;
    } else {
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/array/contains.js.map