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
	
	var response = {
		urlServiceLayer : 'fakeLayersService',
		layers:
			[
			   {
			      map_name:"default",
			      layer_name:"IGN Base",
			      wms_layer:"IGNBaseTodo",
			      wms_url:"http:\/\/www.ign.es\/wms-inspire\/ign-base",
			      visible:false,
			      layer_position:512,
			      layer_group:"Capas Base",
			      parameters:{opacity: 0.75, singleTile: false},
			      is_base:true
			   },
			   {
			      map_name:"default",
			      layer_name:"Topogr\u00e1fico-IDEE",
			      wms_layer:"mtn_rasterizado",
			      wms_url:"http:\/\/www.idee.es\/wms\/MTN-Raster\/MTN-Raster",
			      visible:false,
			      layer_position:510,
			      layer_group:"Capas Base",
			      parameters:{opacity: 0.60, singleTile: false},
			      is_base:true
			   }
			]
	};
	
	var wmsLayers = [new OpenLayers.Layer.WMS(
			"IGN Base",
			"http:\/\/www.ign.es\/wms-inspire\/ign-base",
			{
				//GetMap parameters
				layers: "IGNBaseTodo",
				transparent : true,
				format : "image/png"
			}, {
				isBaseLayer : true,
				visibility : false,
				singleTile : false,
				opacity : 0.75,
				transitionEffect : 'resize',
				buffer : 0
			}
		),
		new OpenLayers.Layer.WMS(
				"Topogr\u00e1fico-IDEE",
				"http:\/\/www.idee.es\/wms\/MTN-Raster\/MTN-Raster",
				{
					//GetMap parameters
					layers: "mtn_rasterizado",
					transparent : true,
					format : "image/png"
				}, {
					isBaseLayer : true,
					visibility : false,
					singleTile : false,
					opacity : 0.60,
					transitionEffect : 'resize',
					buffer : 0
				}
		)
	];

	var getLayer = new OpenLayers.Layer.WMS(
			"fakeLayerTitle",
			"fakeURLWMS",
			{
				//GetMap parameters
				layers: "fakeLayerID",
				transparent : true,
				format : "image/png"
			}, {
				isBaseLayer : false,
				visibility : true,
				singleTile : true,
				opacity : 1,
				transitionEffect : 'resize',
				buffer : 0
			}
	);

	var reader = new XVM.Loader.Reader();
	var layers;
	beforeEach(function() {
		XVM.EventBus = new XVM.Event.EventBus();
		spyOn(reader, 'readFromFile');
		layers = new XVM.Loader.Layers(reader);
	});

	it('Response has urlServiceLayer reads url', function() {
		layers._readLayersCallback(response, layers);
		expect(reader.readFromFile.mostRecentCall.args[0]).toEqual('fakeLayersService');
	});
		
	it('Get layer from json response', function() {
		layers._createLayers(response.layers, layers);
		// We check it created the expected number of layers
		expect(layers.layers.length).toEqual(wmsLayers.length);
		// We check both layers have the expected values
		// (can't compare them directly because of the internal id)
		expect(layers.layers[0].options).toEqual(wmsLayers[0].options);
		expect(layers.layers[0].params).toEqual(wmsLayers[0].params);
		expect(layers.layers[0].name).toEqual(wmsLayers[0].name);
		expect(layers.layers[0].url).toEqual(wmsLayers[0].url);
		expect(layers.layers[1].options).toEqual(wmsLayers[1].options);
		expect(layers.layers[1].params).toEqual(wmsLayers[1].params);
		expect(layers.layers[1].name).toEqual(wmsLayers[1].name);
		expect(layers.layers[1].url).toEqual(wmsLayers[1].url);
	});
	
	it('Get layer from url parameters', function() {
		layers.fromGETParameters = {
			urlwms : 'fakeURLWMS',
			layerid : 'fakeLayerID',
			layertitle : 'fakeLayerTitle'
		};
		layers._createLayers(response.layers, layers);
		// We check it created the expected number of layers
		expect(layers.layers.length).toEqual(wmsLayers.length + 1);
		// We check both layers have the expected values
		// (can't compare them directly because of the internal id)
		for (var i = 0; i < wmsLayers.length; i++) {
			expect(layers.layers[i].options).toEqual(wmsLayers[i].options);
			expect(layers.layers[i].params).toEqual(wmsLayers[i].params);
			expect(layers.layers[i].name).toEqual(wmsLayers[i].name);
			expect(layers.layers[i].url).toEqual(wmsLayers[i].url);
		}
		// We check the GET layer
		var i = layers.layers.length - 1;
		expect(layers.layers[i].options).toEqual(getLayer.options);
		expect(layers.layers[i].params).toEqual(getLayer.params);
		expect(layers.layers[i].name).toEqual(getLayer.name);
		expect(layers.layers[i].url).toEqual(getLayer.url);
	});
});
