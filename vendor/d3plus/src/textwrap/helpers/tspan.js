(function() {
  module.exports = function(vars) {
    var anchor, dx, dy, ellipsis, fontSize, h, height, line, lineWidth, lines, mirror, newLine, placeWord, progress, reverse, rmod, rotate, rx, ry, space, start, textBox, translate, truncate, valign, width, words, wrap, x, y, yOffset;
    newLine = function(w, first) {
      var tspan;
      if (!w) {
        w = "";
      }
      if (!reverse || first) {
        tspan = vars.container.value.append("tspan");
      } else {
        tspan = vars.container.value.insert("tspan", "tspan");
      }
      return tspan.attr("x", x + "px").attr("dx", dx + "px").attr("dy", dy + "px").style("baseline-shift", "0%").attr("dominant-baseline", "alphabetic").text(w);
    };
    mirror = vars.rotate.value === -90 || vars.rotate.value === 90;
    width = mirror ? vars.height.inner : vars.width.inner;
    height = mirror ? vars.width.inner : vars.height.inner;
    if (vars.shape.value === "circle") {
      anchor = "middle";
    } else {
      anchor = vars.align.value || vars.container.align || "start";
    }
    if (anchor === "end") {
      dx = width;
    } else if (anchor === "middle") {
      dx = width / 2;
    } else {
      dx = 0;
    }
    valign = vars.valign.value || "top";
    x = vars.container.x;
    fontSize = vars.resize.value ? vars.size.value[1] : vars.container.fontSize || vars.size.value[0];
    dy = vars.container.dy || fontSize * 1.1;
    textBox = null;
    progress = null;
    words = null;
    reverse = false;
    yOffset = 0;
    if (vars.shape.value === "circle") {
      if (valign === "middle") {
        yOffset = ((height / dy % 1) * dy) / 2;
      } else if (valign === "end") {
        yOffset = (height / dy % 1) * dy;
      }
    }
    vars.container.value.attr("text-anchor", anchor).attr("font-size", fontSize + "px").style("font-size", fontSize + "px").attr("x", vars.container.x).attr("y", vars.container.y);
    truncate = function() {
      textBox.remove();
      if (reverse) {
        line++;
        textBox = vars.container.value.select("tspan");
      } else {
        line--;
        textBox = d3.select(vars.container.value.node().lastChild);
      }
      if (!textBox.empty()) {
        words = textBox.text().match(/[^\s-]+-?/g);
        return ellipsis();
      }
    };
    lineWidth = function() {
      var b;
      if (vars.shape.value === "circle") {
        b = ((line - 1) * dy) + yOffset;
        if (b > height / 2) {
          b += dy;
        }
        return 2 * Math.sqrt(b * ((2 * (width / 2)) - b));
      } else {
        return width;
      }
    };
    ellipsis = function() {
      var lastChar, lastWord;
      if (words && words.length) {
        lastWord = words.pop();
        lastChar = lastWord.charAt(lastWord.length - 1);
        if (lastWord.length === 1 && vars.text.split.value.indexOf(lastWord) >= 0) {
          return ellipsis();
        } else {
          if (vars.text.split.value.indexOf(lastChar) >= 0) {
            lastWord = lastWord.substr(0, lastWord.length - 1);
          }
          textBox.text(words.join(" ") + " " + lastWord + "...");
          if (textBox.node().getComputedTextLength() > lineWidth()) {
            return ellipsis();
          }
        }
      } else {
        return truncate();
      }
    };
    placeWord = function(word) {
      var current, joiner, next_char;
      current = textBox.text();
      if (reverse) {
        next_char = vars.text.current.charAt(vars.text.current.length - progress.length - 1);
        joiner = next_char === " " ? " " : "";
        progress = word + joiner + progress;
        textBox.text(word + joiner + current);
      } else {
        next_char = vars.text.current.charAt(progress.length);
        joiner = next_char === " " ? " " : "";
        progress += joiner + word;
        textBox.text(current + joiner + word);
      }
      if (textBox.node().getComputedTextLength() > lineWidth()) {
        textBox.text(current);
        textBox = newLine(word);
        if (reverse) {
          return line--;
        } else {
          return line++;
        }
      }
    };
    start = 1;
    line = null;
    lines = null;
    wrap = function() {
      var i, len, next_char, unsafe, word;
      vars.container.value.selectAll("tspan").remove();
      vars.container.value.html("");
      words = vars.text.words.slice(0);
      if (reverse) {
        words.reverse();
      }
      progress = words[0];
      textBox = newLine(words.shift(), true);
      line = start;
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (line * dy > height) {
          truncate();
          break;
        }
        placeWord(word);
        unsafe = true;
        while (unsafe) {
          next_char = vars.text.current.charAt(progress.length + 1);
          unsafe = vars.text.split.value.indexOf(next_char) >= 0;
          if (unsafe) {
            placeWord(next_char);
          }
        }
      }
      if (line * dy > height) {
        truncate();
      }
      return lines = Math.abs(line - start) + 1;
    };
    wrap();
    lines = line;
    if (vars.shape.value === "circle") {
      space = height - lines * dy;
      if (space > dy) {
        if (valign === "middle") {
          start = (space / dy / 2 >> 0) + 1;
          wrap();
        } else if (valign === "bottom") {
          reverse = true;
          start = height / dy >> 0;
          wrap();
        }
      }
    }
    if (valign === "top") {
      y = 0;
    } else {
      h = lines * dy;
      y = valign === "middle" ? height / 2 - h / 2 : height - h;
    }
    y -= dy * 0.2;
    translate = "translate(0," + y + ")";
    if (vars.rotate.value === 180 || vars.rotate.value === -180) {
      rx = vars.container.x + width / 2;
      ry = vars.container.y + height / 2;
    } else {
      rmod = vars.rotate.value < 0 ? width : height;
      rx = vars.container.x + rmod / 2;
      ry = vars.container.y + rmod / 2;
    }
    rotate = "rotate(" + vars.rotate.value + ", " + rx + ", " + ry + ")";
    return vars.container.value.attr("transform", rotate + translate);
  };

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/textwrap/helpers/tspan.js.map