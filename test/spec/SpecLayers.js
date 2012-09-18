/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Loader.Layers tests
 */
describe('Layers tests', function() {
	
	var reader = new XVM.Loader.Reader();
	var layers;
	
	beforeEach(function() {
		spyOn(reader, 'readFromFile');
	});
	
	it('Inits control', function() {
		layers = new XVM.Loader.Layers(reader);	
	});
});
