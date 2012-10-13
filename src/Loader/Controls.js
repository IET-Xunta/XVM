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

XVM.Loader.Controls = XVM.Class.extend({
	
	/**
	 * Constant
	 * {String}
	 */
	DEFAULTCONTROLS : 'config/map.controls.yaml',
	
	/**
	 * 
	 */
	CONTROLSFOLDER : 'Control',
	
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
	controls : new Array(),
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	panelControls : new Array(),
	
	/**
	 * Method
	 */
	readControls : function() {
		this.reader.readFromFile(
			this.DEFAULTCONTROLS,
			this._readControlsCallback,
			this
		)
	},
	
	/**
	 * 
	 */
	_readControlsCallback : function(response, this_) {
		var controls = response.controls
		for(var n in controls) {
			var controlName = controls[n];
			var controlPath = this_.CONTROLSFOLDER + '/' + controlName + '/' + controlName;
			var controlLoader = new XVM.Control.ControlLoader(controlPath, controlName, this_.reader);
			controlLoader.loadControl();
		}
		
	},

	/**
	 * 
 	 * @param {Object} reader
	 */
	initialize : function(reader) {
		this.reader = reader;
	}
})