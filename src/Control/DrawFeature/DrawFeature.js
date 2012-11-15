/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.DrawFeature = XVM.Control.extend({
	
	addToPanel : true,

	createControl : function() {
	},

	beforeAddingControl : function() {
		var layers = this.OLMap.getLayersByName(this.options.layerName);
		// Here we get the feature type from the config yaml,
		// which can be 'point', 'path', 'polygon' or 'regularPolygon'
		var handler = eval('OpenLayers.Handler.' + capitaliseFirstLetter(this.options.featureType));
		if (layers.length > 0) {
			if (typeof this.options.handlerOptions !== 'undefined') {
				this.OLControl = new OpenLayers.Control.DrawFeature(layers[0], handler, this.options.handlerOptions);
			} else {
				this.OLControl = new OpenLayers.Control.DrawFeature(layers[0], handler);
			}
		} else {
			throw ("XVM.Control.DrawFeature couldn't load the layer '" + this.options.layerName + "'");
		}
	}
});
