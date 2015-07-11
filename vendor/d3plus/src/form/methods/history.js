(function() {
  module.exports = {
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
    states: []
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/form/methods/history.js.map