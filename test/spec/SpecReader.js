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
		var fakeData = 'general:\n'
		fakeData += ' lang: es';
		spyOn($, 'ajax').andCallFake(			
			function(params){
				params.success(fakeData);
		})
		reader.read('../config/map.options.yaml');
		expect(reader.parameters.general.lang).toEqual('es');
	});
})
