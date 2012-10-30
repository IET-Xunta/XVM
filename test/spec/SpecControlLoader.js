/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Control.ControlLoader tests
 */

describe('ControlLoader Tests', function() {

	var fakeResponse = {'init': 
		{'fakeParameter': 'fakeValue'}
	};

	var fakePath = 'spec/aux/FakeMousePosition/FakeMousePosition';

	var controlloader, reader;
	beforeEach(function() {
		reader = new XVM.Loader.Reader();
		spyOn(reader, 'readFromFile');
		controlloader = new XVM.Control.ControlLoader(fakePath, 'FakeMousePosition', reader);
	});

	it('LoadControl saves object with parameters', function() {
		// TODO
	});
});
