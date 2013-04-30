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
				'zoom_level' : 5}
			};
	
	var fakeLayer = new OpenLayers.Layer.WMS( "fakeData",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},
            {isBaseLayer: true} );
	fakeLayer.layer_position = 0;
	
	var anotherFakeLayer = new OpenLayers.Layer.WMS( "anotherFakeData",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},
            {isBaseLayer: true} );
	anotherFakeLayer.layer_position = 1;

	var fakeoverlay1 = new OpenLayers.Layer.WMS( "fakeoverlay1",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},
            {isBaseLayer: false});
	fakeoverlay1.layer_position = 2;
	
	var fakeoverlay2 = new OpenLayers.Layer.WMS( "fakeoverlay2",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},
            {isBaseLayer: false} );
	fakeoverlay2.layer_position = 3;
	
	var fakeoverlay3 = new OpenLayers.Layer.WMS( "fakeoverlay3",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},
            {isBaseLayer: false} );
	fakeoverlay3.layer_position = 4;
	

	var map = new XVM.Map();
	var controlFake = new XVM.ControlFake();
	
	beforeEach(function() {

	});

	it('Config parameters loads into map', function() {
		map.addConfigParameters(fakeData);
		expect(map.OLMap.options.units).toEqual('m');
	});

	it('Map add layers', function() {
		var layers = [fakeLayer, 
		               anotherFakeLayer, 
		               fakeoverlay1,
		               fakeoverlay2,
		               fakeoverlay3];
		map.addLayers(layers);
		expect(map.OLLayers.length).toEqual(layers.length);
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
	
	it('Map uses layer_position to set base layer', function() {
		expect(map.OLMap.baseLayer).toEqual(anotherFakeLayer);
		fakeLayer.isBaseLayer = true;
		fakeLayer.layer_position = 1;
		fakeLayer.visibility = true;
		anotherFakeLayer.layer_position = 0;
		map = new XVM.Map();
		var layers = [fakeLayer,
		               anotherFakeLayer,
		               fakeoverlay1,
		               fakeoverlay2,
		               fakeoverlay3];
		map.addXVMControl(controlFake);
		map.addConfigParameters(fakeData);
		map.addLayers(layers);
		map.drawMap();
		expect(map.OLMap.baseLayer).toEqual(fakeLayer);
	});
	
	it('Map uses layer_position with overlay layers', function() {
		expect(map.OLMap.layers[fakeoverlay1.layer_position]).toEqual(fakeoverlay1);
		expect(map.OLMap.layers[fakeoverlay2.layer_position]).not.toEqual(fakeoverlay1);
		expect(map.OLMap.layers[fakeoverlay3.layer_position]).toEqual(fakeoverlay3);
	});
});
