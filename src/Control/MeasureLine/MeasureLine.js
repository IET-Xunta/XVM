/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

function handleLineMeasurement(event) {
	var units = event.units;
	var measure = new Number(event.measure.toFixed(4));
	alert($.i18n("distance") + " : " + measure.toLocaleString() + " " + units);
};

XVM.Control.MeasureLine = XVM.Control.extend({

	addToPanel : true,

	createControl : function() {
		this.OLControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, this.options);
	},

	beforeAddingControl : function() {
		this.OLControl.events.on({
			"measure": handleLineMeasurement
	    });
	}
});
