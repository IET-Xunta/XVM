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
 * EventBus is a bus to change events between parts of
 * XVM
 *
 */

XVM.Event.EventBus = function() {
	
	/**
	 * Property
	 * {Array(Object)}
	 */
	this.listeners = new Array();
	
	/**
	 * 
	 */
	this.addListener = function(listener) {
		this.listeners.push(listener);
	}
	
	/**
	 * Fires configParameters into listeners
	 */
	this.fireaddConfigParameters = function(parameters) {
		for (var i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i]['addConfigParameters']) {
				this.listeners[i].addConfigParameters(parameters);
			}
		}
	}
	
	/**
	 * Fires addLayers into listeners
	 * Parameters:
	 * {Array(OpenLayers.Layer.WMS)}
	 */
	this.fireaddLayers = function(layers) {
		for (var i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i]['addLayers']) {
				this.listeners[i].addLayers(layers);
			}
		}
	}	
}
