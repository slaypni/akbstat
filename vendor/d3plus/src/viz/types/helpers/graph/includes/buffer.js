(function() {
  var buckets, closest;

  buckets = require("../../../../../util/buckets.coffee");

  closest = require("../../../../../util/closest.coffee");

  module.exports = function(vars, axis, buffer) {
    var additional, allNegative, allPositive, closestTime, copy, diff, difference, domain, domainCompare, domainHigh, domainLow, i, lowerDiff, lowerMod, lowerScale, lowerValue, maxSize, opp, range, rangeMax, second, strings, timeIndex, upperDiff, upperMod, upperScale, upperValue, zero;
    if (vars[axis].scale.value !== "share" && !vars[axis].range.value && vars[axis].reset) {
      if (axis === vars.axes.discrete) {
        domain = vars[axis].scale.viz.domain();
        if (typeof domain[0] === "string") {
          i = domain.length;
          while (i >= 0) {
            domain.splice(i, 0, "d3plus_buffer_" + i);
            i--;
          }
          range = vars[axis].scale.viz.range();
          range = buckets(d3.extent(range), domain.length);
          return vars[axis].scale.viz.domain(domain).range(range);
        } else {
          if (axis === "y") {
            domain = domain.slice().reverse();
          }
          if (vars[axis].ticks.values.length === 1) {
            if (vars[axis].value === vars.time.value && vars.data.time.ticks.length !== 1) {
              closestTime = closest(vars.data.time.ticks, domain[0]);
              timeIndex = vars.data.time.ticks.indexOf(closestTime);
              if (timeIndex > 0) {
                domain[0] = vars.data.time.ticks[timeIndex - 1];
              } else {
                diff = vars.data.time.ticks[timeIndex + 1] - closestTime;
                domain[0] = new Date(closestTime.getTime() - diff);
              }
              if (timeIndex < vars.data.time.ticks.length - 1) {
                domain[1] = vars.data.time.ticks[timeIndex + 1];
              } else {
                diff = closestTime - vars.data.time.ticks[timeIndex - 1];
                domain[1] = new Date(closestTime.getTime() + diff);
              }
            } else {
              domain[0] -= 1;
              domain[1] += 1;
            }
          } else if (vars.axes.scale) {
            difference = Math.abs(domain[1] - domain[0]);
            additional = difference / (vars[axis].ticks.values.length - 1);
            additional = additional / 2;
            rangeMax = vars[axis].scale.viz.range()[1];
            maxSize = vars.axes.scale.range()[1] * 1.5;
            domainLow = vars[axis].scale.viz.invert(-maxSize);
            domainHigh = vars[axis].scale.viz.invert(rangeMax + maxSize);
            if (domain[0] - additional < domainLow) {
              domain[0] = domain[0] - additional;
              domain[1] = domain[1] + additional;
            } else {
              domain = [domainLow, domainHigh];
              if (axis === "y") {
                domain = domain.reverse();
              }
              domainCompare = vars[axis].scale.viz.domain();
              domainCompare = domainCompare[1] - domainCompare[0];
              if (!domainCompare) {
                domain[0] -= 1;
                domain[1] += 1;
              }
            }
          } else {
            difference = Math.abs(domain[1] - domain[0]);
            additional = difference / (vars[axis].ticks.values.length - 1);
            additional = additional / 2;
            domain[0] = domain[0] - additional;
            domain[1] = domain[1] + additional;
          }
          if (axis === "y") {
            domain = domain.reverse();
          }
          return vars[axis].scale.viz.domain(domain);
        }
      } else if ((buffer === "x" && axis === "x") || (buffer === "y" && axis === "y") || (buffer === true)) {
        domain = vars[axis].scale.viz.domain();
        allPositive = domain[0] >= 0 && domain[1] >= 0;
        allNegative = domain[0] <= 0 && domain[1] <= 0;
        if (vars[axis].scale.value === "log") {
          zero = allPositive ? 1 : -1;
          if (allPositive && axis === "y") {
            domain = domain.slice().reverse();
          }
          lowerScale = Math.pow(10, parseInt(Math.abs(domain[0])).toString().length - 1) * zero;
          lowerMod = domain[0] % lowerScale;
          lowerDiff = lowerMod;
          if (lowerMod && lowerDiff / lowerScale <= 0.1) {
            lowerDiff += lowerScale * zero;
          }
          lowerValue = lowerMod === 0 ? lowerScale : lowerDiff;
          domain[0] -= lowerValue;
          if (domain[0] === 0) {
            domain[0] = zero;
          }
          upperScale = Math.pow(10, parseInt(Math.abs(domain[1])).toString().length - 1) * zero;
          upperMod = domain[1] % upperScale;
          upperDiff = Math.abs(upperScale - upperMod);
          if (upperMod && upperDiff / upperScale <= 0.1) {
            upperDiff += upperScale * zero;
          }
          upperValue = upperMod === 0 ? upperScale : upperDiff;
          domain[1] += upperValue;
          if (domain[1] === 0) {
            domain[1] = zero;
          }
          if (allPositive && axis === "y") {
            domain = domain.reverse();
          }
        } else {
          zero = 0;
          if (axis === "y") {
            domain = domain.slice().reverse();
          }
          strings = domain.filter(function(d) {
            return d.constructor === String;
          });
          additional = Math.abs(domain[1] - domain[0]) * 0.05 || 1;
          if (!strings.length) {
            domain[0] = domain[0] - additional;
            domain[1] = domain[1] + additional;
            if ((allPositive && domain[0] < zero) || (allNegative && domain[0] > zero)) {
              domain[0] = zero;
            }
            if ((allPositive && domain[1] < zero) || (allNegative && domain[1] > zero)) {
              domain[1] = zero;
            }
          }
          if (axis === "y") {
            domain = domain.reverse();
          }
        }
        return vars[axis].scale.viz.domain(domain);
      } else if (vars.axes.scale) {
        copy = false;
        if (vars.axes.mirror.value) {
          opp = axis === "y" ? "x" : "y";
          copy = vars[opp].scale.viz;
          second = vars.width.viz > vars.height.viz ? "x" : "y";
        }
        if (axis === second && copy) {
          domain = copy.domain().slice().reverse();
        } else {
          rangeMax = vars[axis].scale.viz.range()[1];
          maxSize = vars.axes.scale.range()[1];
          domainLow = vars[axis].scale.viz.invert(-maxSize * 1.5);
          domainHigh = vars[axis].scale.viz.invert(rangeMax + maxSize * 1.5);
          domain = [domainLow, domainHigh];
          if (axis === "y") {
            domain = domain.reverse();
          }
          domainCompare = vars[axis].scale.viz.domain();
          domainCompare = domainCompare[1] - domainCompare[0];
          if (!domainCompare) {
            domain[0] -= 1;
            domain[1] += 1;
          }
          if (axis === "y") {
            domain = domain.reverse();
          }
        }
        return vars[axis].scale.viz.domain(domain);
      }
    }
  };

}).call(this);

//# sourceMappingURL=../../../../../../../../_sourcemaps/vendor/d3plus/src/viz/types/helpers/graph/includes/buffer.js.map