/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Loader.Config tests
 */

xdescribe('Config tests', function() {
	
	var eventbus = new XVM.Event.EventBus();
	var reader = new XVM.Loader.Reader();
	var config;
	beforeEach(function() {
		spyOn(eventbus, 'fireConfigParameters');
		spyOn(reader, 'readFromFile');
		XVM.EventBus = eventbus;
	});
	
	it('inits control, sets reader & call eventbus with parameters', function() {
		config = new XVM.Loader.Config(reader);
		expect(eventbus.fireConfigParameters).toHaveBeenCalled();
	})
})
