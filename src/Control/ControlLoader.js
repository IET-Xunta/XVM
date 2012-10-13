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

	initialize : function(path, name, reader) {
		this.controlPath = path;
		this.controlName = name;
		this.reader = reader;
	},

	loadControl : function(callBack) {
		var controlPath = this.controlPath + '/' + this.controlName + '/' + this.controlName
		var controlConfigFile = this.controlPath + '.yaml';
		this.reader.readFromFile(
			controlConfigFile, 
			function(response, this_) {
				this_.initParameters = response.init;
				// Load control code into app
				var controlCodeURL = this_.controlPath + '.js';
				this_.reader.loadScript(
					controlCodeURL, 
					function(response, this_) {
						eval('callBack(new XVM.Control.' + this_.controlName + '(this_.initParameters))');
						}, 
					this_)
		}, this)
	}
})
