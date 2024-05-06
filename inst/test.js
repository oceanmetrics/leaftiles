function(el, x) {
  var vectorServer  = 'https://tile.calcofi.io';
  var vectorLayerId = 'public.stations';
  var vectorUrl     = vectorServer + '/' + vectorLayerId + '/{z}/{x}/{y}.pbf';

  console.log('Reading tiles from ' + vectorUrl);

  var vectorTileStyling = {};
  vectorTileStyling[vectorLayerId] = {
    'fill': true,
    'fillColor': 'blue',
    'fillOpacity': 0.1,
    'color': 'blue',
    'opacity': 0.7,
    'weight': 2
  };

  var vectorTileOptions = {
    'rendererFactory':       L.svg.tile, // L.canvas.tile,
    'interactive':           true,
    'vectorTileLayerStyles': vectorTileStyling
  };

  var vectorLayer = L.vectorGrid.protobuf(vectorUrl, vectorTileOptions);

  vectorLayer.addTo(this);
}
