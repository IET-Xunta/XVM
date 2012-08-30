/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Loader.Reader tests
 */

describe('Reader tests', function(){
	
	var reader = new XVM.Loader.Reader();
	
	beforeEach(function() {
		
	});
	
	it('reads a YAML file and returns object with values', function() {
		reader.read('../../config/config.yaml');
		
		expect(reader.object.general.lang).toEqual('es');
	});
})
