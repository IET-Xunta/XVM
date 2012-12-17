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

XVM.Control.ControlLoader = XVM.Class.extend({
	
	reader : null,

	initParameters : {},
	
	controlPath : "",
	
	controlName : "",

	controlPosition : null,

	initialize : function(path, name, position, reader) {
		this.controlPath = path;
		this.controlName = name;
		this.controlPosition = position;
		this.reader = reader;
	},

	loadControl : function(callBack) {
		this.reader.loadCssFile(this.controlPath + this.controlName + '.css');
		var controlConfigFile = this.controlPath + this.controlName + '.yaml';
		this.reader.readFromFile(
			controlConfigFile, 
			function(response, this_) {
				if (response != null) {
					if (response.properties != null) {
						$.i18n().load(response.properties);
					}
					this_.initParameters = response.init;
					if (typeof response.position !== 'undefined') {
						this_.controlPosition = response.position;
					}
				}
				// Load control code into app
				var controlCodeURL = this_.controlPath + this_.controlName + '.js';
				this_.reader.loadScript(
					controlCodeURL, 
					function(response, this_) {
						// In case we included a function as a trigger, we eval its reference
						evalObject(this_.initParameters);
						eval('callBack(new XVM.Control.' + this_.controlName + '(this_.initParameters, this_.controlPath, this_.controlPosition))');
						}, 
					this_);
		}, this);
	}
});
