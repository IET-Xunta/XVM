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
	VERSION_NUMBER : 0.1,
	
	/**
	 * Object to loaders 
	 */
	Loader : {},
	
	/**
	 * Utils
	 */
	Util : { 
		'getLocationSearch' : function() {
			return window.location.search
		}
	},
	
	/**
	 * Event Bus
	 */
	EventBus : null
};
