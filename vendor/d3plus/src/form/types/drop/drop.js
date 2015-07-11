(function() {
  module.exports = function(vars) {
    var button, data, element, keyboard, list, search, selector, title, update, width, windowevent;
    element = require("./functions/element.coffee");
    keyboard = require("./functions/keyboard.coffee");
    windowevent = require("./functions/window.js");
    width = require("./functions/width.js");
    button = require("./functions/button.js");
    selector = require("./functions/selector.js");
    title = require("./functions/title.js");
    search = require("./functions/search.js");
    list = require("./functions/list.js");
    data = require("./functions/data.js");
    update = require("./functions/update.js");
    vars.margin.top = 0;
    vars.margin.title = 0;
    element(vars);
    keyboard(vars);
    windowevent(vars);
    width(vars);
    button(vars);
    selector(vars);
    title(vars);
    search(vars);
    list(vars);
    data(vars);
    return update(vars);
  };

}).call(this);

//# sourceMappingURL=../../../../../../_sourcemaps/vendor/d3plus/src/form/types/drop/drop.js.map