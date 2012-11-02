/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

function launchPermalinkDialog(){
    var p = this.map.getControlsByClass('OpenLayers.Control.Permalink')[0];
    var my_url = p.base + '?'+ OpenLayers.Util.getParameterString(p.createParams());
    window.prompt($.i18n("permalink_prompt"), my_url);
};

XVM.Control.PermalinkButton = XVM.Control.extend({
	
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
		this.OLMap.addControl(new OpenLayers.Control.Permalink({anchor:false}));
		this.OLControl = new OpenLayers.Control.Button(this.options);
		this.OLMap.panel.addControls([this.OLControl]);
	}
});
