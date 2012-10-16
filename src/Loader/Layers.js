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
	this.fromGETParameters = null
	
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
	}
	
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
	}
	
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
			 	wms_url : _this.fromGETParameters.urlwms,
				visible : true,
			  	//layer_position : 0,
			  	//layer_group : 'Capas Base',
				parameters : {opacity : 1, singleTile : true},
				is_base : false
			}
			response.push(GETLayer);
		}
		for(var n in response) {
			var objectLayer = response[n];
			var default_options = {
				isBaseLayer : objectLayer.is_base,
				visibility : objectLayer.visible,
				singleTile : true,
				opacity : 0.75,
				transitionEffect : 'resize',
				buffer : 0
			};
			var layer_options = $.extend(default_options, objectLayer.parameters);
			var layer = new OpenLayers.Layer.WMS(
				objectLayer.layer_name, 
				objectLayer.wms_url, 
				{
					//GetMap parameters
					layers: objectLayer.wms_layer,
					transparent : true,
					format : "image/png"
				}, 
				layer_options
			)
			_this.layers.push(layer);
		}
		XVM.EventBus.fireEvent('addLayers', _this.layers);
	}
	
	/**
	 * Method
	 * Parameters:
	 * {XVM.Loader.Reader}
	 */
	this.init = function(reader) {
		this.reader = reader;
		this._readLayers();
	}

	this.init(reader);
}
