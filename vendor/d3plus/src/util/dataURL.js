(function() {
  module.exports = function(url, callback) {
    var img;
    img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      var canvas, context;
      canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      context = canvas.getContext("2d");
      context.drawImage(this, 0, 0);
      callback.call(this, canvas.toDataURL("image/png"));
      canvas = null;
    };
  };

}).call(this);

//# sourceMappingURL=../../../../_sourcemaps/vendor/d3plus/src/util/dataURL.js.map