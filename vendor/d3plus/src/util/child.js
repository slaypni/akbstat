(function() {
  var d3selection;

  d3selection = require("./d3selection.coffee");

  module.exports = function(parent, child) {
    var node;
    if (!parent || !child) {
      return false;
    }
    if (d3selection(parent)) {
      parent = parent.node();
    }
    if (d3selection(parent)) {
      child = child.node();
    }
    node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/child.js.map