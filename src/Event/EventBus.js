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
	this.listeners = {};

	/**
	 * 
	 */
	this.addListener = function(listener, callFunction, event) {
		if (!this.listeners[event]) {
			this.listeners[event] = new Array();
		}
		this.listeners[event].push([listener, callFunction]);
	};

	/**
	 * Fires an event into listeners
	 */
	this.fireEvent = function(event, parameters) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(
				function callEventHandler(handler) {
					handler[0][handler[1]](parameters);
				}
			);
		}
	};

};
