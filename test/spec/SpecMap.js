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
				 'epsg' : 4326,
				 'units': 'm',
				 'resolutions': [1, 10, 1000, 10000, 100000],
				 'tile_size': [100, 100],
				 'bounds': [-100000, 3950000, 1150000, 4900000]
				},
			'view_settings' :{
				'center' : 
					{
					'lat': 4742294,
					'lon': 562770
					},
				'zoom_level' : 5,
				'bbox' : [
				          -90000, 3850000, 1100000, 4850000
				         ]}
			};
	
	var fakeLayer = new OpenLayers.Layer.WMS( "fakeData",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'} );

	var map = new XVM.Map();
	var controlFake = new XVM.ControlFake();
	
	beforeEach(function() {

	});

	it('Config parameters loads into map', function() {
		map.addConfigParameters(fakeData);
		expect(map.OLMap.options.units).toEqual('m');
	});

	it('Map add layers', function() {
		map.addLayers([fakeLayer]);
		expect(map.OLLayers[0]).toEqual(fakeLayer);
	});
	
	it('Proper subcontrol added into map', function() {
		map.addXVMControl(controlFake);
		expect(controlFake.OLMap).toEqual(map.OLMap);
	});

	it('Wrong subcontrol added into map', function() {
		var test = function() {
			map.addXVMControl({});
		};
		expect(test).toThrow();
	});
	
	it('Map sets center and zoom level', function() {
		map.drawMap();
		expect(map.OLMap.getCenter().lon).toEqual(fakeData.view_settings.center.lon);
		expect(map.OLMap.getCenter().lat).toEqual(fakeData.view_settings.center.lat);
	});
});