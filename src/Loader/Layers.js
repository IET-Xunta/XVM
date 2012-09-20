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
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	this.layers = new Array();

	/**
	 * Method
	 */
	this._readLayers = function() {
		this.reader.readFromFile(
			this.DEFAULTLAYERS, 
			this._readLayersCallback
		);
	}
	
	/**
	 *
	 */
	this._readLayersCallback = function(response, context) {
		var _this = context;
		if(response.urlServiceLayer != null) {
			_this.reader.readFromFile(
				response.urlServiceLayer, 
				_this._createLayers
			);
		} else {
			var tmpresponse = response.layers;
			_this._createLayers(tmpresponse, context);
		}
		XVM.EventBus.fireaddLayers(_this.layers);
	}
	
	/**
	 *
	 */
	this._createLayers = function(response, context) {
		var _this = context;
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
					transparent : true,
					format : "image/png"
				}, 
				layer_options
			)
			_this.layers.push(layer);
		}
	}
	
	/**
	 * Method
	 * Parameters:
	 * {XVM.Loader.Reader}
	 */
	this.init = function(reader) {
		this.reader = reader;
		this.reader.setContext(this);
		this._readLayers();
	}

	this.init(reader);
}
