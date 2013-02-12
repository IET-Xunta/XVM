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
 * @requires WFSLayer.js
 */

/**
 * WFS Layers control tests 
 */
describe('WFS Layer tests', function() {
	
	var parameters = getJSONFixture('wfslayer.layers.json');
	
	XVM.EventBus = new XVM.Event.EventBus();
	var WFSControl = new XVM.Control.WFSLayer();	
	WFSControl.options = parameters.init;
	
	beforeEach(function(){
		
	});
	
	it('', function() {
		
	});
	
});