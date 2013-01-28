/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.MousePosition = XVM.Control.extend({

	createControl : function() {
		this.OLControl = new OpenLayers.Control.MousePosition(this.options);
	},
	
	afterAddingControl : function() {
		this.OLControl.prefix = this.OLMap.displayProjection.projCode + " ";
		$('.olControlMousePosition').click(function(evt) {
			XVM.EventBus.fireEvent('setMapSize', this);
		});
	}
});
