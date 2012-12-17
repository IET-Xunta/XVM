/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
* https://forxa.mancomun.org/projects/xeoportal
* http://xeovisorminimo.forxa.mancomun.org
* 
* @author Instituto Estudos do Territorio, IET
*
*/

/**
 * @requires XVM.js
 */

/** 
 * Map class reads OpenLayers.Map options from map.options.yaml file into config folder
 * and loads maps with this parameters. Also reads parameters from GET petition
 * and loads this. This GET parameters are assign by defaults into file map.options.yaml
 */

/**
 * Configurable parameters by GET:
 *  - EPSG {String} CRS code EPSG can be set to EPSG=25829 projection, defaults EPSG:23029 is set
 * 	- URLWMS {String} Service URL
 *  - LAYERID {String} Layer Id
 *  - LAYERTITLE {String} Layer title or name
 * 	- BBOX {String} Get parameter (Xmin, Ymin, Xmax, Ymax) like WMS 1.1.1 bbox parameter 
 *  - LANG {String} Language to inteface
 * 	- INFOFORMAT {String} Configurable format to featureinfo response
 * 
 * Configurable OpenLayers.Map options:
 *  - resolutions {Array(Number)}
 *  - maxExtent {OpenLayers.Bounds}
 * 	- units {String}
 * 	- controls 
 */

XVM.Map = function() {
	
	/**
	 * Property
	 * {Array(OpenLayers.Layer)}
	 */
	this.OLLayers = null;
	
	/**
	 * Saves OpenLayers Map
	 * Property
	 * {OpenLayers.Map}
	 */
	this.OLMap = null;
	
	/**
	 * Saves XVM Controls
	 * Property
	 * {Array(XVM.Control)}
	 */
	this.controls = [];
	
	/**
	 * Saves config parameters
	 * Property
	 * {Object}
	 */
	this.parameters = null;
	
	/**
	 * 
	 */
	this.loaded = 0;

	this.divName = null;

	/**
	 * Launched with event addConfigParameter
	 */
	this.addConfigParameters = function(parameters) {
		
		this.parameters = parameters;

		var options = {
			projection : new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			displayProjection: new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			units: parameters.map_settings.units,
			resolutions	: parameters.map_settings.resolutions,
			maxResolution: 1000,
			tileSize: new OpenLayers.Size(
				parseInt(parameters.map_settings.tile_size[0]),
				parseInt(parameters.map_settings.tile_size[1])
			),
			maxExtent : new OpenLayers.Bounds(
				parseInt(parameters.map_settings.bounds[0]),
				parseInt(parameters.map_settings.bounds[1]),
				parseInt(parameters.map_settings.bounds[2]),
				parseInt(parameters.map_settings.bounds[3])
			),
			controls : []
		};
		this.OLMap = new OpenLayers.Map(this.divName, options);
		$('#' + this.divName).css(
			{
				'height' : parameters.general.height_map + 'px',  
				'width' : parameters.general.width_map + 'px',
				'margin' : parameters.general.margin + 'px'
			}
		);
		this.OLMap.panel = new OpenLayers.Control.Panel();
		this.OLMap.addControl(this.OLMap.panel);
		this.loaded += 1;
		if(this.loaded == 3) {
			this.drawMap();
		};
        OpenLayers.ProxyHost = parameters.general.proxy_host;		
	};
	
	/**
	 * Launched with event addLayers
	 */
	this.addLayers = function(layers) {
		if (!this.OLLayers) {
			this.OLLayers = layers;
			this.loaded += 1;
			if(this.loaded == 3) {
				this.drawMap();
			}
		} else {
			this.OLLayers = this.OLLayers.concat(layers);
			if(this.loaded == 3) {
				this.addLayersToOLMap(layers);
			}
		}
	};
	
	/**
	 * 
	 */
	this.addControls = function(controls) {
		this.controls = controls;
		this.controls.sort(function(a, b) {
			return a.position-b.position;
		})
		this.loaded += 1;
		if(this.loaded == 3) {
			this.drawMap();
		}
	};
	
	this.addLayersToOLMap = function(layers) {
		//this.OLMap.addLayers(this.OLLayers);
		var baseLayer = this.OLMap.baseLayer;

		for(var n=0; n<layers.length; n++) {
			var layer = layers[n];
			this.OLMap.addLayer(layer);
			this.OLMap.setLayerIndex(layer, layer.layer_position);
			
			if (layer.isBaseLayer == true) {
				if (baseLayer == null) 
					baseLayer = layer;
				else 
					baseLayer = (baseLayer.layer_position > layer.layer_position) ? layer : baseLayer;	
			};
		};

		if (baseLayer != null) {
			this.OLMap.setBaseLayer(baseLayer);
		}
	};

	/**
	 * REFACTOR
	 */
	this.drawMap = function() {
		
		this.addLayersToOLMap(this.OLLayers);

		// Temporarily added control
		for(var n=0; n<this.controls.length; n++) {
			this.addXVMControl(this.controls[n]);
		}

		if (typeof this.parameters.view_settings !== 'undefined') {
			if ((typeof this.parameters.view_settings.bbox !== 'undefined')
					&& (this.parameters.view_settings.bbox.length == 4)) {
				var extent = new OpenLayers.Bounds(
					parseInt(this.parameters.view_settings.bbox[0]),
					parseInt(this.parameters.view_settings.bbox[1]),
					parseInt(this.parameters.view_settings.bbox[2]),
					parseInt(this.parameters.view_settings.bbox[3])
				);
				this.OLMap.zoomToExtent(extent, true);
			} else {
				if ((typeof this.parameters.view_settings.center !== 'undefined')
						&& (typeof this.parameters.view_settings.center.lon !== 'undefined')
						&& (typeof this.parameters.view_settings.center.lat !== 'undefined')) {
					var center = new OpenLayers.LonLat(
							this.parameters.view_settings.center.lon,
							this.parameters.view_settings.center.lat);
					this.OLMap.setCenter(center);
				}
				if (typeof this.parameters.view_settings.zoom !== 'undefined') {
					this.OLMap.zoomTo(this.parameters.view_settings.zoom);
				}
			}
		}
		
		XVM.EventBus.fireEvent('mapCompleted', this);
	};
	
	/**
	 * Constructor
	 */
	this.init = function(divName) {
		this.divName = (typeof divName === "undefined") ? XVM.DIVNAME : divName;
		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
		XVM.EventBus.addListener(this, 'addConfigParameters', 'addConfigParameters');
		XVM.EventBus.addListener(this, 'addLayers', 'addLayers');
		XVM.EventBus.addListener(this, 'addControls', 'addControls');
	}
	
	this.addXVMControl = function(control) {
		if (!(control instanceof XVM.Control)) {
			throw 'Control not supported';
		}
		control.setOLMap(this.OLMap);
	};

	this.init();
};
