(function() {
  module.exports = {
    accepted: [false, Number, String],
    deprecates: "highlight",
    process: function(value, vars) {
      var d, element, elementTag, elementType, i, j, k, len, len1, ref;
      element = vars.data.element.value;
      if (element && ["string", "number"].indexOf(typeof value) >= 0) {
        elementTag = element.node().tagName.toLowerCase();
        elementType = element.attr("type");
        if (elementTag === "select") {
          ref = element.selectAll("option");
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            d = ref[i];
            if (d && d[vars.id.value] === value) {
              element.node().selectedIndex = i;
            }
          }
        } else if (elementTag === "input" && elementType === "radio") {
          for (k = 0, len1 = element.length; k < len1; k++) {
            d = element[k];
            this.checked = d && d[vars.id.value] === value;
          }
        }
      }
      return value;
    },
    value: false
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/focus.js.map