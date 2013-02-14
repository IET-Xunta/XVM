/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

/**
 * @requires Control.js
 */

XVM.Control.FullScreen = XVM.Control.extend({
	
	addToPanel : true,
	
	/**
	 * Overwrites createControl parent method
	 */
	createControl : function() {
		this.OLControl = new OpenLayers.Control(this.options);
		this.OLControl.trigger = this.trigger;
	},	
	
	trigger : function() {
	    var p = this.map.getControlsByClass('OpenLayers.Control.Permalink')[0];
	    var base_url = p.base;
	    var index = base_url.indexOf('?');
	    if (index > -1) {
	        base_url = base_url.slice(0, index);
	    }
	    var my_url = base_url + '?'+ OpenLayers.Util.getParameterString(p.createParams());
	    window.open(my_url + '&fullscreen=true', $.i18n("fullscreen_prompt"));
	},
	
	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
	}
});