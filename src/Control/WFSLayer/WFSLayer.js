/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

/**
 * @requires Control.js
 */

/**
 * Load WFS Layers into XVM.Map
 */
XVM.Control.WFSLayer = XVM.Control.extend({
	
	/**
	 * Save WFS layers
	 * Property: wfsLayer
	 * OpenLayers.Layer.Vector
	 */	
	vectorLayers : [],

	/**
	 * Method: createControl
	 * Creates the control and adds listener to zoom searches
	 */
	createControl : function() {
		this.OLControl = new OpenLayers.Control();
		XVM.EventBus.addListener(this, 'searchAndZoom', 'searchAndZoom');
	},
	
	/**
	 * Method: createVectorLayer
	 * Creates the vector layer and adds to map
	 */
	createVectorLayer : function() {

		var protocols = this.options.protocols;
		
		for (var i=0; i<protocols.length; i++) {
			var protocol = new OpenLayers.Protocol.WFS({
	               url:  protocols[i].url,
	               featureType: protocols[i].featureType,
	               featurePrefix: protocols[i].featurePrefix,
	               featureNS: protocols[i].featureNS,
	               srsName: protocols[i].srsName,
	               maxFeatures: protocols[i].maxFeatures
			});
			protocol.name = protocols[i].layer_name;

			var vectorLayer = new OpenLayers.Layer.Vector(protocol.name, 
					{
						strategies : [new OpenLayers.Strategy.BBOX()],
						protocol : protocol,
						styleMap: new OpenLayers.StyleMap(protocols[i].styleMap),
						searchFields : protocols[i].searchFields,
						visibility : protocols[i].visibility
					});

			this.vectorLayers.push(vectorLayer);
		}
		
		XVM.EventBus.fireEvent('addLayers', this.vectorLayers);
	},
	
	/**
	 * Method: searchAndZoom
	 * Searches into layer the features that meet the requeriments of the parameters
	 * Launchs an event to do zoom in bounds of the feature
	 * @param params 
	 */
	searchAndZoom : function(params) {

		var filters = [];
		for (var field in params.queryParams) {
			var filter = new OpenLayers.Filter.Comparison({
	                type: OpenLayers.Filter.Comparison.EQUAL_TO,
	                property: field,
	                value: params.queryParams[field]
            });
			filters.push(filter);
		}
		var layer = params.layer;
		var protocol = layer.protocol;
		
		var OLfilter = new OpenLayers.Filter.Logical({
         	type: OpenLayers.Filter.Logical.OR,
         	filters: filters
		});
		
		protocol.read({
			filter : OLfilter,
			callback : function(evt) {
				if (evt.priv.status != 200) {
					alert('Error en respuesta'); // TODO localice
					return;
				}
				var features = evt.features;
				var searchBounds = new OpenLayers.Bounds();

				if (features.length != 0) {
					for (var j=0; j<features.length; j++) {
						var feature = layer.getFeatureByFid(features[j].fid);
						searchBounds.extend(feature.geometry.bounds);
					};
	
					XVM.EventBus.fireEvent('setExtent', 
							{'extent' : searchBounds, 
							'closest' : false}
					);				
				} else {
					var error = {'message' : "Feature no encontrada"}
					XVM.EventBus.fireEvent('showsError', error)
				}
			}
		});
	},

	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
		this.createVectorLayer();
	}
});
