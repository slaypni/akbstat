(function() {
  var geo_map;

  geo_map = function(vars) {
    var coords, features, key, mute, solo, topo;
    topojson.presimplify(vars.coords.value);
    coords = vars.coords.value;
    key = d3.keys(coords.objects)[0];
    topo = topojson.feature(coords, coords.objects[key]);
    features = topo.features;
    solo = vars.coords.solo.value;
    mute = vars.coords.mute.value;
    features = features.filter(function(f) {
      f[vars.id.value] = f.id;
      if (solo.length) {
        return solo.indexOf(f.id) >= 0;
      } else if (mute.length) {
        return mute.indexOf(f.id) < 0;
      } else {
        return true;
      }
    });
    return features;
  };

  geo_map.libs = ["topojson"];

  geo_map.nesting = false;

  geo_map.requirements = ["coords"];

  geo_map.scale = 1;

  geo_map.shapes = ["coordinates"];

  geo_map.zoom = true;

  module.exports = geo_map;

}).call(this);

//# sourceMappingURL=../../../../../_sourcemaps/vendor/d3plus/src/viz/types/geo_map.js.map