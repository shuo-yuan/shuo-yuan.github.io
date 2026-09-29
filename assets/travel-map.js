// Life page world map: countries listed in data-visited are highlighted, the rest stay gray.
(function () {
  var el = document.querySelector('.travel-map');
  if (!el) return;

  var ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var WIDTH = 960;

  var visited = el.getAttribute('data-visited').split(';')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  // The atlas draws French Guiana as part of France; give it its own (unvisited) shape.
  function splitFrenchGuiana(f) {
    if (f.properties.name !== 'France' || f.geometry.type !== 'MultiPolygon') return [f];
    var europe = [], guiana = [];
    f.geometry.coordinates.forEach(function (poly) {
      (poly[0][0][0] < -30 ? guiana : europe).push(poly);
    });
    return [
      { type: 'Feature', properties: { name: 'France' }, geometry: { type: 'MultiPolygon', coordinates: europe } },
      { type: 'Feature', properties: { name: 'French Guiana' }, geometry: { type: 'MultiPolygon', coordinates: guiana } }
    ];
  }

  fetch(ATLAS)
    .then(function (res) { return res.json(); })
    .then(function (world) {
      var countries = topojson.feature(world, world.objects.countries).features
        .filter(function (f) { return f.properties.name !== 'Antarctica'; })
        .reduce(function (out, f) { return out.concat(splitFrenchGuiana(f)); }, []);
      var all = { type: 'FeatureCollection', features: countries };
      var projection = d3.geoNaturalEarth1().fitWidth(WIDTH, all);
      var path = d3.geoPath(projection);
      var height = Math.ceil(path.bounds(all)[1][1]);

      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + WIDTH + ' ' + height);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'World map highlighting countries visited: ' + visited.join(', '));

      var found = {};
      countries.forEach(function (f) {
        var name = f.properties.name;
        var isVisited = visited.indexOf(name) !== -1;
        if (isVisited) found[name] = true;

        var p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', path(f));
        p.setAttribute('class', isVisited ? 'country visited' : 'country');
        var title = document.createElementNS(SVG_NS, 'title');
        title.textContent = name;
        p.appendChild(title);
        svg.appendChild(p);
      });

      visited.forEach(function (name) {
        if (!found[name]) console.warn('travel-map: "' + name + '" is not a country name on the map');
      });

      el.replaceChildren(svg);
    })
    .catch(function () {
      el.innerHTML = '<p class="muted">The map could not be loaded.</p>';
    });
})();
