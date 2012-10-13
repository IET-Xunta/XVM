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
	
	control : null,

	initialize : function(path, name, reader) {
		this.controlPath = path;
		this.controlName = name;
		this.reader = reader;
	},

	loadControl : function() {
		var controlPath = this.controlPath + '/' + this.controlName + '/' + this.controlName
		var controlConfig = this.controlPath + '.yaml';
		this.reader.readFromFile(
			controlConfig, 
			function(response, this_) {
				this_.initParameters = response.init;
				// Load control code into app
				var controlCodeURL = this_.controlPath + '.js';
				this_.reader.loadScript(
					controlCodeURL, 
					function(response, this_) {
						console.log("TODO Control loaded message")
						eval('this_.control = new XVM.Control.' + this_.controlName + '(this_.initParameters)');
						}, 
					this_)
		}, this)
	}
})
