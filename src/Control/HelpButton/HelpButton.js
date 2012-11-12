/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

function launchHelpDialog(){
	alert($.i18n("help_alert"));
};

XVM.Control.HelpButton = XVM.Control.extend({

	addToPanel : true,

	createControl : function() {
		this.OLControl = new OpenLayers.Control.Button(this.options);
	}
});
