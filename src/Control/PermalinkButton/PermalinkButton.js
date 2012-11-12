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
    var base_url = p.base;
    var index = base_url.indexOf('?');
    if (index > -1) {
        base_url = base_url.slice(0, index);
    }
    var my_url = base_url + '?'+ OpenLayers.Util.getParameterString(p.createParams());
    window.prompt($.i18n("permalink_prompt"), my_url);
};

XVM.Control.PermalinkButton = XVM.Control.extend({

	addToPanel : true,

	createControl : function() {
		this.OLControl = new OpenLayers.Control.Button(this.options);
	},

	beforeAddingControl : function() {
		this.OLMap.addControl(new OpenLayers.Control.Permalink({anchor:false}));
	}
});
