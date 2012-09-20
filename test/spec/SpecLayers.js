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
	
	var reader = new XVM.Loader.Reader();
	var layers;
	beforeEach(function() {
		spyOn(reader, 'readFromFile');
		layers = new XVM.Loader.Layers(reader);
	});

	it('Response has urlServiceLayer reads url', function() {
		layers._readLayersCallback(response, layers);
		expect(reader.readFromFile.mostRecentCall.args[0]).toEqual('fakeLayersService');
	})
		
	it('Get layer from json response', function() {
		layers._createLayers(response.layers, layers);
		expect(layers.layers.length).toEqual(response.layers.length);
		expect(layers.layers[0].opacity).toEqual(0.75);
	});
});
