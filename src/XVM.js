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
*/

/**
 * XeoVisor minimo uses YAML files to config application files. Is
 * neccesary JS-YAML library to do this operation.
 */

/**
 * Namespace to XeoVisor Mínimo
 */

var XVM = {
	
	/**
	 * The version number
	 */
	VERSION_NUMBER : 2,
	
	/**
	 * Loaders namespace 
	 */
	Loader : {},
	
	/**
	 * Control namespace
	 */
	Control : {},
	
	/**
	 * Utils namespace
	 */
	Util : { 
		'getLocationSearch' : function() {
			return window.location.search;
		}
	},
	
	/**
	 * Events namespace
	 */
	Event : {},
	
	/**
	 * Event Bus
	 * Saves inside the eventbus of XVM
	 */
	EventBus : null,

	/**
	 * Default Config File URL
	 */
	DefaultConfig : 'config/map.options.yaml',

	/**
	 * Default Global Reader
	 */
	Reader : null,

	/**
	 * Default Map Div Name
	 */
	DivName : 'map',
	
	/**
	 * Default method for building the global objects
	 */
	_initGlobalContext : function() {
		this.EventBus = new XVM.Event.EventBus();
		this.Reader = new XVM.Loader.Reader();
	},
	
	/**
	 * Default method for building loaders
	 */
	_createDefaultLoaders : function() {
		new XVM.Loader.Config();
		new XVM.Loader.Layers();
		new XVM.Loader.Controls();
	},
	
	/**
	 * Default method for building a map
	 */
	createDefaultMap : function(divName) {
		this._initGlobalContext();
		new XVM.Map(divName);
		this._createDefaultLoaders();
	}
};
