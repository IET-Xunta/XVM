/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.CustomLayerSwitcher = XVM.Control.extend({

	createLateControl : function() {
		this.OLControl = new XVM.Control.OLCustomLayerSwitcher(this.options);
		if (this.OLMap != null) {
			this.addControl();
		}
	},

	createControl : function() {
		$.ajax({
			type : 'GET',
			url : this.controlPath + 'OLCustomLayerSwitcher.js',
			context : this,
			dataType : 'script',
			success : this.createLateControl
		});
	}
});
