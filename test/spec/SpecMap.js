/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Map tests
 */

describe('Map tests', function() {
	
	XVM.EventBus = new XVM.Event.EventBus();
	var fakeData = {'general': {'lang' : 'es','epsg' : 23029}};
	beforeEach(function() {

	});
	
	it('Config parameters sends event', function() {
		var map = new XVM.Map();
		XVM.EventBus.fireaddConfigParameters(fakeData);
		
		expect(map.OLMapParameters.general.lang).toEqual('es');
	})
})