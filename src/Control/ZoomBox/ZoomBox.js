/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.ZoomBox = XVM.Control.extend({

	addToPanel : true,

	createControl : function() {
		this.OLControl = new OpenLayers.Control.ZoomBox(this.options);
	}
});
