/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */
/*
 * Necessary fake control used in SpecMap.js
 */

XVM.ControlFake = XVM.Control.extend({
	
	OLMap : null,
	
	initialize : function() {
	},
	setOLMap : function(map) {
		this.OLMap = map;
	}
});
