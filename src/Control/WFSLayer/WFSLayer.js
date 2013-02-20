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
	protocol : null,

	createControl : function() {
		this.OLControl = new OpenLayers.Control();
	},
	
	saveProtocols : function() {

		var protocolparams = this.options.protocol;
		
		var protocol = new OpenLayers.Protocol.WFS({
               url:  protocolparams.url,
               featureType: protocolparams.featureType,
               featurePrefix: protocolparams.featurePrefix,
               featureNS: protocolparams.featureNS,
               srsName: protocolparams.srsName,
               maxFeatures: protocolparams.maxFeatures
		});
		
		protocol.name = protocolparams.layer_name;
		
		console.log(protocol);

		var vectorLayer = new OpenLayers.Layer.Vector(protocol.name, 
				{
					strategies : [new OpenLayers.Strategy.BBOX()],
					protocol : protocol,
					styleMap: new OpenLayers.StyleMap(this.options.styleMap)
				});
		
		protocol.read({
			callback: function(evt) {
				console.log(evt);
			}
		});
			
		XVM.EventBus.fireEvent('addLayers', [vectorLayer]);
	},

	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
		this.saveProtocols();
	}
});
