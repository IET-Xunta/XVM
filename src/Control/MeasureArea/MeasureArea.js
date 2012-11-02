/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

function handleAreaMeasurement(event) {
	var units = event.units;
	var measure = new Number(event.measure.toFixed(4));
	alert($.i18n("area") + " : " + measure.toLocaleString() + " " + units + "²");
};

XVM.Control.MeasureArea = XVM.Control.extend({
	
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
		this.OLControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, this.options);
		this.OLControl.events.on({
			"measure": handleAreaMeasurement
	    });
		this.OLMap.panel.addControls([this.OLControl]);
	}
});
