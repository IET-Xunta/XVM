/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

/** Sample function passed to the control in order to be called after each feature modification finishes
 *	This will be called only when using this specific control
 *	This is configure through the yaml file 
 *  IMPORTANT: OpenLayers lists this as DEPRECATED, and suggests using the layer event */
function pointModified(feature){
	if (typeof feature.layer.new_features[feature.id] !== 'undefined') {
		feature.layer.new_features[feature.id] = feature;
	} else {
		feature.layer.updated_features[feature.id] = feature;
	}
	alert('Updated feature coordinates x: ' + feature.geometry.x + ', y: ' + feature.geometry.y);
	var new_features = 'New features ';
	for (var i in feature.layer.new_features) {
		new_features += i + ' ';
	}
	alert(new_features);
	var updated_features = 'Updated features ';
	for (var i in feature.layer.updated_features) {
		updated_features += i + ' ';
	}
	alert(updated_features);
	var deleted_features = 'Deleted features ';
	for (var i in feature.layer.deleted_features) {
		deleted_features += i + ' ';
	}
	alert(deleted_features);
};


/** Sample function we set as an event listener onto the layer
 *  This will be called every time we finish modifying a feature from the layer, with any control
 *	This is configured through code, function 'afterAddingControl' */
function featureModified(event){
	alert('Feature new coordinates x: ' + event.feature.geometry.x + ', y: ' + event.feature.geometry.y);
};

XVM.Control.ModifyFeature = XVM.Control.extend({
	
	addToPanel : true,

	createControl : function() {
	},

	beforeAddingControl : function() {
		var layers = this.OLMap.getLayersByName(this.options.layerName);
		if (layers.length > 0) {
			this.OLControl = new OpenLayers.Control.ModifyFeature(layers[0], this.options.options);
		} else {
			throw ("XVM.Control.ModifyFeature couldn't load the layer '" + this.options.layerName + "'");
		}
	},

	afterAddingControl : function() {
		//this.OLControl.layer.events.register('afterfeaturemodified', this.OLControl.layer, featureModified);
	}
});
