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
 * Controls class uses Reader to get controls from YAML file
 *
 * TODO Tests
 */
XVM.Loader.Controls = function(reader) {
	
	/**
	 * Constant
	 * {String}
	 */
	this.DEFAULTCONTROLS = 'config/map.controls.yaml';
	
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
	this.controls = new Array();
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	this.panelControls = new Array();
	
	/**
	 * Method
	 */
	this._readControl = function() {
		this.reader.readFromFile(
			this.DEFAULTCONTROLS,
			this._readControlsCallback
		)
	};
	
	/**
	 * 
	 */
	this._readControlCallbacks = function(response, context) {
		// TODO
	};
	
	/**
	 * 
	 */
	this.init = function(reader) {
		this.reader = reader;
		this.reader.setContext(this);
		this._readControls();
	}
	
	this.init(reader);
}
