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
	 * [OpenLayers.Protocol.WFS]
	 */	
	protocols : [],

	createControl : function() {
		this.OLControl = new OpenLayers.Control();
	},
	
	saveProtocols : function() {
		for (var i=0; i<this.options.protocols.length; i++) {
			var protocolparams = this.options.protocols[i];
			var protocol = new OpenLayers.Protocol.WFS({
                url:  protocolparams.url,
                featureType: protocolparams.featureType,
                featurePrefix: protocolparams.featurePrefix,
                featureNS: protocolparams.featureNS,
                srsName: protocolparams.srsName,
                maxFeatures: protocolparams.maxFeatures
			});
			protocol.name = protocolparams.layer_name;
			this.protocols.push(protocol);
			this.loadLayers();
		}	
	},
	
	loadLayers : function() {
		
		var layers = [];
		
		for (var i=0; i<this.protocols.length; i++) {
			var protocol = this.protocols[i];
			var vectorLayer = new OpenLayers.Layer.Vector(protocol.name, 
					{
						strategies : [new OpenLayers.Strategy.BBOX()],
						protocol : protocol
					});
			layers.push(vectorLayer);
		}
		XVM.EventBus.fireEvent('addLayers', layers);
	},

	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
		this.saveProtocols();
	}
});
