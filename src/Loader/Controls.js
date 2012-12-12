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
	_readControls : function() {
		this.reader.readFromFile(
			XVM.CONTROLSFILE,
			this._readControlsCallback,
			this
		)
	},
	
	/**
	 * 
	 */
	_readControlsCallback : function(response, this_) {
		var createTOC = response.TOC;
		var controls = response.controls;
		var nControls = 0;
		if (controls.length == 0) {
			XVM.EventBus.fireEvent('addControls', []);
		}
		for(var n=0, length=controls.length; n<length; n++) {
			var controlName = controls[n];
			var controlPath = XVM.CONTROLSFOLDER + '/' + controlName + '/';
			var controlLoader = new XVM.Control.ControlLoader(controlPath, controlName, n, this_.reader);
			controlLoader.loadControl(function(control) {
				this_.controls.push(control);
				nControls += 1;
				if(nControls == controls.length) {
					if (createTOC) {
						XVM.EventBus.fireEvent('addTOC');
					}
					XVM.EventBus.fireEvent('addControls', this_.controls);
				}
			});	
		}
	},

	/**
	 * 
 	 * @param {Object} reader
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readControls();
	}
})