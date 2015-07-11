(function() {
  module.exports = {
    accepted: [false, Array, Number, String],
    html: {
      accepted: [Boolean],
      value: false
    },
    init: function(vars) {
      var s;
      s = this.split.value;
      this["break"] = new RegExp("[^\\s\\" + s.join("\\") + "]+\\" + s.join("?\\") + "?", "g");
      return false;
    },
    split: {
      accepted: [Array],
      value: ["-", "/", ";", ":", "&"]
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/textwrap/methods/text.js.map