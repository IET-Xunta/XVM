/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.ScaleLine = XVM.Control.extend({

	createControl : function() {
		this.OLControl = new OpenLayers.Control.ScaleLine(this.options);
	}
});
