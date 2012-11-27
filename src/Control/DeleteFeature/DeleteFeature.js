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
