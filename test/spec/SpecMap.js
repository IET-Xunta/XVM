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
	var fakeData = {'general': {'height' : 300, 'width' : 300},
			'map_settings':
				{'lang' : 'es',
				 'epsg' : 23029,
				 'units': 'm',
				 'resolutions': [1, 10, 1000, 10000, 100000],
				 'tile_size': [100, 100],
				 'bounds': [-100000, 3950000, 1150000, 4900000]
				}
			};
	var map;
	beforeEach(function() {
		map = new XVM.Map();
	});

	var controlFake = new XVM.ControlFake();

	it('Config parameters sends event', function() {
		XVM.EventBus.fireEvent('addConfigParameters', fakeData);
		expect(map.OLMap.options.units).toEqual('m');
	});

	it('Proper subcontrol added into map', function() {
		map.addXVMControl(controlFake);
		expect(controlFake.OLMap).toEqual(map);
	});

	it('Wrong subcontrol added into map', function() {
		var test = function() {
			map.addXVMControl({});
		};
		expect(test).toThrow();
	});
})