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

describe('Config tests', function() {

	var fakeURL = '?map_settings.EPSG=EPSG:30000&general.LANG=chi&view_settings.BBOX=1,2,3,4';

	var reader = new XVM.Loader.Reader();
	var config;
	var expectedConfig = {
			general: {
				lang: 'chi',
				height_map: 300,
				width_map: 300
			}, map_settings: {
				epsg: 'EPSG:30000',
				tile_size: [ 512, 512 ],
				units: 'm',
				bounds: [ 460000, 4625000, 690000, 4855000 ],
				resolutions: [ 611.4962262814, 305.7481131407, 152.8740565704,
				               76.4370282852, 38.2185141426, 19.1092570713,
				               9.5546285356, 4.7773142678, 2.3886571339,
				               1.194328567, 0.5971642835, 0.2985821417 ]
			}, view_settings: {
				bbox: [ '1', '2', '3', '4' ],
				zoom_level: 5,
				center: { lat: 0, lon: 0 }
			}
	};
	beforeEach(function() {
		XVM.EventBus = new XVM.Event.EventBus();
		XVM.DefaultConfig = 'spec/aux/map.options.yaml';
		spyOn(XVM.EventBus, 'fireEvent');
		spyOn(XVM.Util, 'getLocationSearch').andReturn(fakeURL);
	});
	
	it('Creating a new Config', function() {
		config = new XVM.Loader.Config(reader);
		waitsFor(function() {
		      return XVM.EventBus.fireEvent.calls.length == 1;
		    }, "Event never fired", 10000);
		runs(function () {
			expect(XVM.EventBus.fireEvent).toHaveBeenCalledWith('addConfigParameters', expectedConfig);
		});
	});
});
