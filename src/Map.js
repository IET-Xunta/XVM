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
	 * Launched with event addConfigParameter
	 */
	this.addConfigParameters = function(parameters) {
		
		var options = {
			projection : new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			displayProjection: new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			units: parameters.map_settings.units,
			resolutions	: parameters.map_settings.resolutions,
			tileSize: new OpenLayers.Size(
				parseInt(parameters.map_settings.tile_size[0]),
				parseInt(parameters.map_settings.tile_size[1])
			),
			maxExtent : new OpenLayers.Bounds(
				parseInt(parameters.map_settings.bounds[0]),
				parseInt(parameters.map_settings.bounds[1]),
				parseInt(parameters.map_settings.bounds[2]),
				parseInt(parameters.map_settings.bounds[3])
			)	
		}
		this.OLMap = new OpenLayers.Map('map', options);
		$('#map').css(
			{
				'height' : parameters.general.height_map + 'px',  
				'width' : parameters.general.width_map + 'px',
				'margin' : '0px'
			}
		)
		if(this.OLLayers != null) {
			this.drawMap();
		}
	};
	
	/**
	 * Launched with event addLayers
	 */
	this.addLayers = function(layers) {
		this.OLLayers = layers;
		if(this.OLMap != null) {
			this.drawMap();
		}
	};
	
	/**
	 * REFACTOR
	 */
	this.drawMap = function() {
		this.OLMap.addLayers(this.OLLayers);
		// Temporarily added control
		this.OLMap.addControl(new OpenLayers.Control.LayerSwitcher({ascending:false}));
		//
		this.OLMap.zoomToMaxExtent();		
	}
	
	/**
	 * Constructor
	 */
	this.init = function() {
		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
		XVM.EventBus.addListener(this, 'addConfigParameters', 'addConfigParameters');
	};
	
	this.init();
}