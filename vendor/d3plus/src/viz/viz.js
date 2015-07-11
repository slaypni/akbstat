(function() {
  var attach, axis, container, flash, getSteps, print, validObject;

  attach = require("../core/methods/attach.coffee");

  axis = require("./methods/helpers/axis.coffee");

  flash = require("./helpers/ui/message.js");

  getSteps = require("./helpers/drawSteps.js");

  print = require("../core/console/print.coffee");

  container = require("./helpers/container.coffee");

  validObject = require("../object/validate.coffee");

  module.exports = function() {
    var vars;
    vars = {
      g: {
        apps: {}
      },
      types: {
        bar: require("./types/bar.coffee"),
        bubbles: require("./types/bubbles.coffee"),
        box: require("./types/box.coffee"),
        chart: require("./types/deprecated/chart.coffee"),
        geo_map: require("./types/geo_map.coffee"),
        line: require("./types/line.coffee"),
        network: require("./types/network.js"),
        paths: require("./types/paths.coffee"),
        pie: require("./types/pie.coffee"),
        rings: require("./types/rings.js"),
        scatter: require("./types/scatter.coffee"),
        stacked: require("./types/stacked.coffee"),
        table: require("./types/table.js"),
        tree_map: require("./types/tree_map.coffee")
      }
    };
    vars.self = function(selection) {
      selection.each(function() {
        var lastMessage, nextStep, runFunction, runStep, small_height, small_width, steps;
        vars.draw.frozen = true;
        vars.error.internal = null;
        if (!("timing" in vars.draw)) {
          vars.draw.timing = vars.timing.transitions;
        }
        if (vars.error.value) {
          vars.draw.timing = 0;
        }
        if (vars.container.changed) {
          container(vars);
        }
        small_width = vars.width.value <= vars.width.small;
        small_height = vars.height.value <= vars.height.small;
        vars.small = small_width || small_height;
        vars.width.viz = vars.width.value;
        vars.height.viz = vars.height.value;
        lastMessage = false;
        nextStep = function() {
          if (steps.length) {
            runStep();
          } else {
            if (vars.dev.value) {
              print.groupEnd();
              print.timeEnd("total draw time");
              print.log("\n");
            }
          }
        };
        runFunction = function(step, name) {
          name = name || "function";
          if (step[name] instanceof Array) {
            step[name].forEach(function(f) {
              f(vars, nextStep);
            });
          } else {
            if (typeof step[name] === "function") {
              step[name](vars, nextStep);
            }
          }
          if (!step.wait) {
            nextStep();
          }
        };
        runStep = function() {
          var message, run, same, step;
          step = steps.shift();
          same = vars.g.message && lastMessage === step.message;
          run = "check" in step ? step.check : true;
          if (typeof run === "function") {
            run = run(vars);
          }
          if (run) {
            if (!same) {
              if (vars.dev.value) {
                if (lastMessage !== false) {
                  print.groupEnd();
                }
                print.group(step.message);
              }
              if (typeof vars.messages.value === "string") {
                lastMessage = vars.messages.value;
                message = vars.messages.value;
              } else {
                lastMessage = step.message;
                message = vars.format.value(step.message);
              }
              if (vars.draw.update) {
                flash(vars, message);
                if (vars.error.value) {
                  runFunction(step);
                } else {
                  setTimeout((function() {
                    return runFunction(step);
                  }), 10);
                }
              } else {
                runFunction(step);
              }
            } else {
              runFunction(step);
            }
          } else {
            if ("otherwise" in step) {
              if (vars.error.value) {
                runFunction(step, "otherwise");
              } else {
                setTimeout((function() {
                  return runFunction(step, "otherwise");
                }), 10);
              }
            } else {
              nextStep();
            }
          }
        };
        vars.messages.style.backup = vars.group && vars.group.attr("opacity") === "1" ? "small" : "large";
        steps = getSteps(vars);
        runStep();
      });
      return vars.self;
    };
    attach(vars, {
      active: require("./methods/active.coffee"),
      aggs: require("./methods/aggs.coffee"),
      attrs: require("./methods/attrs.coffee"),
      axes: require("./methods/axes.coffee"),
      background: require("./methods/background.coffee"),
      color: require("./methods/color.coffee"),
      cols: require("./methods/cols.js"),
      config: require("./methods/config.coffee"),
      container: require("./methods/container.coffee"),
      coords: require("./methods/coords.coffee"),
      csv: require("./methods/csv.coffee"),
      data: require("./methods/data.coffee"),
      depth: require("./methods/depth.coffee"),
      descs: require("./methods/descs.coffee"),
      dev: require("./methods/dev.coffee"),
      draw: require("./methods/draw.js"),
      edges: require("./methods/edges.js"),
      error: require("./methods/error.coffee"),
      focus: require("./methods/focus.coffee"),
      font: require("./methods/font.coffee"),
      footer: require("./methods/footer.coffee"),
      format: require("./methods/format.coffee"),
      height: require("./methods/height.coffee"),
      history: require("./methods/history.coffee"),
      icon: require("./methods/icon.coffee"),
      id: require("./methods/id.coffee"),
      labels: require("./methods/labels.coffee"),
      legend: require("./methods/legend.coffee"),
      links: require("./methods/links.coffee"),
      margin: require("./methods/margin.coffee"),
      messages: require("./methods/messages.coffee"),
      nodes: require("./methods/nodes.coffee"),
      order: require("./methods/order.coffee"),
      shape: require("./methods/shape.coffee"),
      size: require("./methods/size.coffee"),
      style: require("./methods/style.coffee"),
      temp: require("./methods/temp.coffee"),
      text: require("./methods/text.coffee"),
      time: require("./methods/time.coffee"),
      timeline: require("./methods/timeline.coffee"),
      timing: require("./methods/timing.coffee"),
      title: require("./methods/title.coffee"),
      tooltip: require("./methods/tooltip.coffee"),
      total: require("./methods/total.coffee"),
      type: require("./methods/type.coffee"),
      ui: require("./methods/ui.coffee"),
      width: require("./methods/width.coffee"),
      x: axis("x"),
      y: axis("y"),
      zoom: require("./methods/zoom.js")
    });
    return vars.self;
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/viz/viz.js.map