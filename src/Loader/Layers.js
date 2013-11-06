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

XVM.Loader.Layers = XVM.Class.extend({

	/**
	 * Property
	 * {XVM.Loader.Reader}
	 */
	reader : null,
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	fromGETParameters : null,
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	layers : new Array(),

	/**
	 * Method
	 */
	_readLayers : function() {
		this.reader.getParamsFromURL(this);
		if (typeof this.fromGETParameters.urllayersfile !== 'undefined'){
		    XVM.LAYERSFILE = this.fromGETParameters.urllayersfile;
		}
		this.reader.readFromFile(
			XVM.LAYERSFILE,
			this._readLayersCallback,
			this
		);
	},
	
	/**
	 * urlServiceLayer indicates where is the service with 
	 * layer structure
	 */
	_readLayersCallback : function(response, context) {
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
	},

    /*
     * This function waits for the existence of some variable.
     * REASON: Sometimes it looks that map.options.yaml is not loaded on time. 
     */
	_waitUntilExists : function(ext_object){
	       if (ext_object == null || typeof ext_object === "undefined"){
	           console.log(ext_object+" not set. Waiting...");
	           setTimeout(_waitUntilExists(ext_object), 500);//wait 50 millisecnds then recheck
	           return;
	       }
	},
	/**
	 *
	 */
	_createLayers : function(response, context) {
		var _this = context;
		if(_this.fromGETParameters.urlwms != undefined) {
			var GETLayer = {
			  	map_name : 'default',
			  	type: 'wms',
			  	layer_name : _this.fromGETParameters.layertitle,
			  	wms_layer : _this.fromGETParameters.layerid,
			 	url : _this.fromGETParameters.urlwms,
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
				 	group_name : '',
					transitionEffect : 'resize',
					buffer : 0
				};
				var layer_options = $.extend(default_options, objectLayer.parameters);

				var aux_url = objectLayer.url;
                //TODO Sometimes map.parameters is undefined at this moment... we have to solve it
                this._waitUntilExists(XVM.map.parameters);
                this._waitUntilExists(XVM.map.parameters.general);
				if (XVM.map.parameters == undefined || 
                    XVM.map.parameters.general.use_wms_throw_proxy == true){
		                aux_url = XVM.map.parameters.general.proxy_host+objectLayer.url;
                }
				var layer = new OpenLayers.Layer.WMS(
					objectLayer.layer_name,
					aux_url,
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
						var layer = new OpenLayers.Layer.Vector("' + objectLayer.layer_name + '",\
								JSON.parse(\'' + JSON.stringify(objectLayer.parameters) + '\'));\
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
			} else if(objectLayer.type == 'google') {
				var default_options = {
					type: google.maps.MapTypeId.SATELLITE,
					isBaseLayer : true,
					group_name : ''
				};
				var layer_options = $.extend(default_options, objectLayer.parameters);
				var layer = new OpenLayers.Layer.Google(objectLayer.layer_name, layer_options);
				_this.layers.push(layer);
			}

		}
		XVM.EventBus.fireEvent('addLayers', _this.layers);
	},
	
	/**
	 * Method
	 * Parameters:
	 * {XVM.Loader.Reader}
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readLayers();
	}
});
