/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

/** Sample function passed to the control in order to be called after each feature adding we make
 *	This will be called only when using this specific control
 *	This is configure through the yaml file */
function pointAdded(feature){
	alert('Point coordinates x: ' + feature.geometry.x + ', y: ' + feature.geometry.y);
};


/** Sample function we set as an event listener onto the layer or the control
 *  This will be called every time we add a new feature to the layer, with any control if we created it onto the layer
 *	This is configured through code, function 'afterAddingControl' */
function featureAdded(event){
	alert('Feature coordinates x: ' + event.feature.geometry.x + ', y: ' + event.feature.geometry.y);
};

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
			if (typeof this.options.options !== 'undefined') {
				this.OLControl = new OpenLayers.Control.DrawFeature(layers[0], handler, this.options.options);
			} else {
				this.OLControl = new OpenLayers.Control.DrawFeature(layers[0], handler);
			}
		} else {
			throw ("XVM.Control.DrawFeature couldn't load the layer '" + this.options.layerName + "'");
		}
	},

	afterAddingControl : function() {
		this.OLControl.events.register('featureadded', this.OLControl.layer, featureAdded);
	}
});
