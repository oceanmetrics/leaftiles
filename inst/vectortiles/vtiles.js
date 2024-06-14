function(el, x) {
  var vectorServer  = '{{server}}';
  var vectorLayerId = '{{layer}}';
  var vectorFilter  = '{{filter}}';

  var vectorUrl     = vectorServer + '/' + vectorLayerId + '/{z}/{x}/{y}.pbf';

  if (vectorFilter)
    var vectorUrl = vectorUrl + '?filter=' + vectorFilter;

  console.log('Reading tiles from ' + vectorUrl);

  var vectorTileStyling = {};
  vectorTileStyling[vectorLayerId] = {{js_style}};

  var vectorTileOptions = {
    'rendererFactory':       L.svg.tile, // L.canvas.tile,
    'interactive':           true,
    // 'attribution':           '&copy; OpenStreetMap',
    'vectorTileLayerStyles': vectorTileStyling,
    'getFeatureId': function(f) {
        // console.log(f)
        return f.properties.{{layerId}}
    }
  };

  var highlight;
	var clearHighlight = function() {
		if (highlight) {
			vectorLayer.resetFeatureStyle(highlight);
		}
		highlight = null;
	};

	function featureHtml(f) {
    var p = f.properties;
    var h = '<p>';
    for (var k in p) {
      h += '<b>' + k + ':</b> ' + p[k] + '<br/>'
    }
    h += '</p>';
    return h
  }

  // Fix error for point data, eg mouseover does not work without this.
  // https://github.com/Leaflet/Leaflet.VectorGrid/issues/267#issuecomment-2060799055
  function patchVectorGridLayer(obj) {
     obj._createLayer_orig = obj._createLayer;
     obj._createLayer = function (feat, pxPerExtent, layerStyle) {
       let layer = this._createLayer_orig(feat, pxPerExtent, layerStyle);
       if (feat.type === 1) {
         layer.getLatLng = null;
       }
       return layer;
     };
    return obj;
  }

  var vectorLayer = patchVectorGridLayer(
    L.vectorGrid.protobuf(vectorUrl, vectorTileOptions)
      .on('click', function (e) {

        // debugger;
        L.popup()
          .setLatLng(e.latlng)
          .setContent(featureHtml(e.layer))
          .openOn(vectorLayer);
        // TODO: get popup working
        // - https://stackoverflow.com/questions/29173336/how-to-display-advanced-customed-popups-for-leaflet-in-shiny
        // - https://github.com/rstudio/leaflet/blob/92bc272caa9a268140e75ede1966bcdc7d585636/R/layers.R#L772-L779
        // - https://github.com/rstudio/leaflet/blob/92bc272caa9a268140e75ede1966bcdc7d585636/javascript/src/methods.js#L90-L98

        clearHighlight();
        highlight = e.layer.properties.{{layerId}};
  		  vectorLayer.setFeatureStyle(highlight, {{js_styleHighlight}})

		    L.DomEvent.stop(e);
      }) );

  vectorLayer.addTo(this);
}
