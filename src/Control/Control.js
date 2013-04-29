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
 * @requires Class.js
 */

XVM.Control = XVM.Class.extend({

	/**
	 * Property: OLMap
	 * Saves the OpenLayers.Map
	 * {OpenLayers.Map}
	 */
	OLMap : null,

	/**
	 * Property: options
	 * Receives parameters from YAML file. 
	 * {Object}
	 */
	options : {},

	/**
	 * Property: position
	 * Control position in panel
	 * {int}
	 */
	position: null,

	/**
	 * Property: controlPath
	 * Path to control folder
	 * {String}
	 */
	controlPath : null,

	/**
	 * Property: OLControl
	 * Saves reference to OpenLayers control. If your control do not need an OpenLayers control for her 
	 * functionality, will be mandatory create a OpenLayers.Control, to avoid that XVM.Map throws an error
	 * {OpenLayers.Control}
	 */
	OLControl : null,
	
	/**
	 * Property: addToPanel
	 * Indicates if button control shows in panel
	 * {boolean}
	 */
	addToPanel : false,

	/**
	 * Property: customOLControlFile
	 * Relative path to the custom OL control file.
	 * {String}
	 */
	customOLControlFile : null,

	/**
	 * Method: createControl
	 * Mandatory. Overwrites createControl in XVM.Control
	 * Execute from XVM.Control.initialize when our control is instantiated
	 */
	createControl : function() {
		throw 'XVM.Control.createControl dummy implementation';
	},

	/**
	 * Method: createConfirmLateControl
	 * Used for creating and confirming dynamically loaded controls.
	 */
	createConfirmLateControl : function() {
		this.createControl();
		this.confirmControl();
	},
	
	/**
	 * Method: initialize
	 * Launchs at instantiate control
	 * @param params 
	 * @param controlPath
	 * @param position
	 */
	initialize : function(params, controlPath, position) {
		this.options = params;
		this.controlPath = controlPath;
		this.position = position;
		if (this.customOLControlFile != null) {
			$.ajax({
				type : 'GET',
				url : this.controlPath + this.customOLControlFile,
				context : this,
				dataType : 'script',
				success : this.createConfirmLateControl
			});
		} else {
			this.createControl();
		}
	},

	/**
	 * Method: setOLMap
	 * Set property OLMap with OpenLayers.Map. Launch from XVM.Map when
	 * added control to XVM.Map
	 * @param map
	 */
	setOLMap : function(map) {
		this.OLMap = map;
		this.addControl();
	},
	
	/**
	 * Method: beforeAddingControl
	 * Launch before add control.
	 */
	beforeAddingControl : function() {
	},
	
	/**
	 * Method: afterAddingControl
	 * Launch before add control.
	 */
	afterAddingControl : function() {
	},

	/**
	 * Method: confirmControl
	 * Used confirming dynamically loaded controls.
	 */
	confirmControl : function() {
		if (this.customOLControlFile != null) {
			XVM.EventBus.fireEvent('confirmControl');
		}
	},

	/**
	 * Method: addControl
	 * Adds control to the OLMap, activates it and adds control to the panel 
	 * depending the addToPanel value.
	 */
	addControl : function() {
		this.beforeAddingControl();
		if (this.addToPanel) {
			this.OLMap.panel.addControls([this.OLControl]);
			if ((this.options != null) && this.options.autoActivate) {
				this.OLControl.activate();
			}
		} else {
			this.OLMap.addControl(this.OLControl);
		}
		this.afterAddingControl();
	}
});
