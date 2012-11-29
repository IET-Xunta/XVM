/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */


/** Function passed to the control in order to be called after each feature selection we make
 *  in order to delete the selected feature after the user confirms it
 *	This will be called only when using this specific control */
function deleteFeature(feature) {
	if (confirm($.i18n("confirm_delete"))) {
		if ((typeof feature.layer.new_features !== 'undefined')
				&& (typeof feature.layer.new_features[feature.id] !== 'undefined')) {
			delete feature.layer.new_features[feature.id];
		} else {
			if ((typeof feature.layer.updated_features !== 'undefined')
					&& (typeof feature.layer.updated_features[feature.id] !== 'undefined')) {
				delete feature.layer.updated_features[feature.id];
			}
			if (typeof feature.layer.deleted_features == 'undefined') {
				feature.layer.deleted_features = {};
			}
			feature.layer.deleted_features[feature.id] = feature;
		}
		alert('Deleted feature coordinates x: ' + feature.geometry.x + ', y: ' + feature.geometry.y);
		feature.layer.removeFeatures([feature]);
	}
};

XVM.Control.DeleteFeature = XVM.Control.extend({

	addToPanel : true,

	createControl : function() {
	},

	beforeAddingControl : function() {
		var layers = this.OLMap.getLayersByName(this.options.layerName);
		if (layers.length > 0) {
			if ((typeof this.options.options == 'undefined') || (this.options.options == null)) {
				this.options.options = {};
			}
			this.options.options.onSelect = deleteFeature;
			this.OLControl = new OpenLayers.Control.SelectFeature(layers[0], this.options.options);
		} else {
			throw ("XVM.Control.DeleteFeature couldn't load the layer '" + this.options.layerName + "'");
		}
	}
});
