/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.Scale = XVM.Control.extend({
	
	OLMap : null,
	
	options : {},
	
	OLControl : null,
	
	initialize : function(params) {
		this.options = params;
	},
	
	setOLMap : function(map) {
		this.OLMap = map;
		this.createControl();
	},
	
	createControl : function() {
		this.OLControl = new OpenLayers.Control.Scale(this.options);
		this.OLMap.addControl(this.OLControl);
	}
});
