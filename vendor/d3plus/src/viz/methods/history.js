(function() {
  module.exports = {
    accepted: [Boolean],
    back: function() {
      if (this.states.length) {
        return this.states.pop()();
      }
    },
    chain: [],
    reset: function() {
      var results;
      results = [];
      while (this.states.length) {
        results.push(this.states.pop()());
      }
      return results;
    },
    states: [],
    value: true
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/methods/history.js.map