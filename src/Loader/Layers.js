/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

/**
 * @requires XVM.js
 * @requires Reader.js
 */

/**
 * Layers class uses Reader to get layers parameters from YAML file
 *
 * TODO Tests
 */

XVM.Loader.Layers = function(reader) {

	/**
	 * Constant
	 * {String}
	 */
	this.DEFAULTLAYERS = 'config/map.layers.yaml';

	/**
	 * Property
	 * {XVM.Loader.Reader}
	 */
	this.reader = null;
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	this.fromGETParameters = null;
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	this.layers = new Array();

	/**
	 * Method
	 */
	this._readLayers = function() {
		this.reader.getParamsFromURL(this);
		this.reader.readFromFile(
			this.DEFAULTLAYERS, 
			this._readLayersCallback,
			this
		);
	};
	
	/**
	 * urlServiceLayer indicates where is the service with 
	 * layer structure
	 */
	this._readLayersCallback = function(response, context) {
		var _this = context;
		if(response.urlServiceLayer != null) {
			_this.reader.readFromFile(
				response.urlServiceLayer, 
				_this._createLayers,
				_this
			);
		} else {
			var tmpresponse = response.layers;
			_this._createLayers(tmpresponse, _this);
		}
	};
	
	/**
	 *
	 */
	this._createLayers = function(response, context) {
		var _this = context;
		if(_this.fromGETParameters.urlwms != undefined) {
			var GETLayer = {
			 	map_name : 'default',
			  	layer_name : _this.fromGETParameters.layertitle,
			  	wms_layer : _this.fromGETParameters.layerid,
			 	url : _this.fromGETParameters.url,
				visible : true,
			  	//layer_position : 0,
			  	//layer_group : 'Capas Base',
				parameters : {opacity : 1, singleTile : true},
				is_base : false
			};
			response.push(GETLayer);
		}

		for(var n=0; n<response.length; n++) {
			var objectLayer = response[n];
			if (objectLayer.type == 'wms') {
				var default_options = {
					isBaseLayer : false,
					visibility : true,
					singleTile : true,
					opacity : 0.75,
					transitionEffect : 'resize',
					buffer : 0
				};
				var layer_options = $.extend(default_options, objectLayer.parameters);
				var layer = new OpenLayers.Layer.WMS(
					objectLayer.layer_name,
					objectLayer.url,
					{
						//GetMap parameters
						layers: objectLayer.wms_layer,
						transparent : true,
						format : "image/png"
					},
					layer_options
				);

			_this.layers.push(layer);

			} else if(objectLayer.type == 'ajax') {
				eval('$.getJSON(objectLayer.url,\
					    "callback=?",\
					    function(data) {\
						var geojson_format = new OpenLayers.Format.GeoJSON();\
						var layer = new OpenLayers.Layer.Vector("' + objectLayer.layer_name + '");\
						layer.addFeatures(geojson_format.read(data));\
						XVM.EventBus.fireEvent("addLayers", [layer]);\
				});');
			} else if(objectLayer.type == 'geojson') {
				objectLayer.parameters.strategies = [new OpenLayers.Strategy.Fixed()];
				objectLayer.parameters.protocol = new OpenLayers.Protocol.HTTP({
					url: objectLayer.url,
					format: new OpenLayers.Format.GeoJSON()
				});

				var layer = new OpenLayers.Layer.Vector(objectLayer.layer_name, objectLayer.parameters);
				_this.layers.push(layer);
			}

		}
		XVM.EventBus.fireEvent('addLayers', _this.layers);
	};
	
	/**
	 * Method
	 * Parameters:
	 * {XVM.Loader.Reader}
	 */
	this.init = function(reader) {
		this.reader = reader;
		this._readLayers();
	};

	this.init(reader);
};
