(function() {
  var arraySort, bubbles, fetchColor, fetchText, fetchValue, groupData, legible;

  arraySort = require("../../array/sort.coffee");

  fetchValue = require("../../core/fetch/value.coffee");

  fetchColor = require("../../core/fetch/color.coffee");

  fetchText = require("../../core/fetch/text.js");

  legible = require("../../color/legible.coffee");

  groupData = require("../../core/data/group.coffee");

  bubbles = function(vars) {
    var column_height, column_width, columns, d, data, dataLength, domain, domainMax, domainMin, downscale, groupedData, i, j, k, l, labelHeight, len, len1, len2, obj, pack, padding, row, rows, screenRatio, size, size_max, size_min, t, temp, xPadding, xoffset, yMod, yPadding, yoffset;
    groupedData = groupData(vars, vars.data.viz);
    groupedData = arraySort(groupedData, null, null, null, vars);
    dataLength = groupedData.length;
    if (dataLength < 4) {
      columns = dataLength;
      rows = 1;
    } else {
      screenRatio = vars.width.viz / vars.height.viz;
      columns = Math.ceil(Math.sqrt(dataLength * screenRatio));
      rows = Math.ceil(Math.sqrt(dataLength / screenRatio));
    }
    if (dataLength > 0) {
      while ((rows - 1) * columns >= dataLength) {
        rows--;
      }
    }
    column_width = vars.width.viz / columns;
    column_height = vars.height.viz / rows;
    if (vars.size.value) {
      domainMin = d3.min(vars.data.viz, function(d) {
        return fetchValue(vars, d, vars.size.value, vars.id.value, "min");
      });
      domainMax = d3.max(vars.data.viz, function(d) {
        return fetchValue(vars, d, vars.size.value, vars.id.value);
      });
      domain = [domainMin, domainMax];
    } else {
      domain = [0, 0];
    }
    padding = 5;
    size_max = (d3.min([column_width, column_height]) / 2) - (padding * 2);
    labelHeight = vars.labels.value && !vars.small && size_max >= 40 ? d3.max([20, d3.min([size_max * 0.25, 50])]) : 0;
    size_max -= labelHeight;
    size_min = d3.min([size_max, vars.size.scale.min.value]);
    size = vars.size.scale.value.domain(domain).rangeRound([size_min, size_max]);
    pack = d3.layout.pack().children(function(d) {
      return d.values;
    }).padding(padding).radius(function(d) {
      return size(d);
    }).size([column_width - padding * 2, column_height - padding * 2 - labelHeight]).value(function(d) {
      return d.value;
    });
    data = [];
    row = 0;
    for (i = j = 0, len = groupedData.length; j < len; i = ++j) {
      d = groupedData[i];
      temp = pack.nodes(d);
      xoffset = (column_width * i) % vars.width.viz;
      yoffset = column_height * row;
      for (k = 0, len1 = temp.length; k < len1; k++) {
        t = temp[k];
        if (t.children) {
          obj = {
            d3plus: {}
          };
          obj[vars.id.value] = t.key;
        } else {
          obj = t.d3plus;
        }
        obj.d3plus.depth = vars.id.grouping.value ? t.depth : vars.depth.value;
        obj.d3plus.x = t.x;
        obj.d3plus.xOffset = xoffset;
        obj.d3plus.y = t.y;
        obj.d3plus.yOffset = yoffset + labelHeight;
        obj.d3plus.r = t.r;
        data.push(obj);
      }
      if ((i + 1) % columns === 0) {
        row++;
      }
    }
    downscale = size_max / d3.max(data, function(d) {
      return d.d3plus.r;
    });
    xPadding = pack.size()[0] / 2;
    yPadding = pack.size()[1] / 2;
    for (l = 0, len2 = data.length; l < len2; l++) {
      d = data[l];
      d.d3plus.x = ((d.d3plus.x - xPadding) * downscale) + xPadding + d.d3plus.xOffset;
      d.d3plus.y = ((d.d3plus.y - yPadding) * downscale) + yPadding + d.d3plus.yOffset;
      d.d3plus.r = d.d3plus.r * downscale;
      delete d.d3plus.xOffset;
      delete d.d3plus.yOffset;
      d.d3plus["static"] = d.d3plus.depth < vars.depth.value && vars.id.grouping.value;
      if (labelHeight && (d.d3plus.depth === 0 || vars.id.grouping.value === false)) {
        d.d3plus.text = fetchText(vars, d[vars.id.value], d.d3plus.depth);
        yMod = labelHeight > vars.labels.padding * 3 ? vars.labels.padding : 0;
        d.d3plus.label = {
          x: 0,
          y: -(size_max + yMod + labelHeight / 2),
          w: size_max * 2,
          h: labelHeight - yMod,
          padding: 0,
          resize: true,
          color: legible(fetchColor(vars, d, d.d3plus.depth)),
          force: true
        };
      } else {
        delete d.d3plus.label;
      }
    }
    return data.sort(function(a, b) {
      return a.d3plus.depth - b.d3plus.depth;
    });
  };

  bubbles.fill = true;

  bubbles.requirements = ["data"];

  bubbles.scale = 1.05;

  bubbles.shapes = ["circle", "donut"];

  module.exports = bubbles;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/bubbles.js.map