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
	 * {Object}
	 */
	this.OLMapParameters = null;
	
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
		console.log(parameters);
		this.OLMapParameters = parameters;
	};
	
	/**
	 * Launched with event addLayers
	 */
	this.addLayers = function(layers) {
		console.log(layers);
		this.OLLayers = layers;
	}
	
	/**
	 * Constructor
	 */
	this.init = function() {
		XVM.EventBus.addListener(this);
	};
	
	this.init();
}
