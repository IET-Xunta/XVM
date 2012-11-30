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
 * Config class uses Reader class to access config files trought
 * YAML files, GET Parameters like URLCONFIG or options parameters
 *
 * TODO Problems to test this class, maybe needs refactor
 */

XVM.Loader.Config = XVM.Class.extend({

	/**
	 * Reader
	 * Property
	 */
	reader : null,

	/**
	 * Object saves config parameters
	 * Property
	 * {Object}
	 */
	configParameters : {
		'general':{},
		'map_settings':{},
		'view_settings': {}
	},
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	fromGETParameters : null,

	_readConfig : function() {
		this.reader.getParamsFromURL(this);
		this.reader.readFromFile(
			XVM.CONFIGFILE,
			function(responseObject, context) {
				var _this = context;
				$.extend(_this.configParameters, responseObject);
				if(_this.fromGETParameters.urlconfig != undefined) {
					_this.reader.readFromFile(
						_this.fromGETParameters.urlconfig, 
						function(responseObject, context) {
							var _this = context;
							$.extend(_this.configParameters, responseObject);
							_this._addParametersFromGET();		
						},
						_this);
				} else {
					_this._addParametersFromGET();
				}
		
			},
			this);
	},
	
	_addParametersFromGET : function() {
		if ((typeof this.configParameters.view_settings !== 'undefined')
				&& (typeof this.configParameters.view_settings.bbox !== 'undefined')
				&& (typeof this.fromGETParameters.lon !== 'undefined')
				&& (typeof this.fromGETParameters.lat !== 'undefined')) {
			delete this.configParameters.view_settings.bbox;
		}
		this.configParameters = overrideValues(this.configParameters, this.fromGETParameters);
		XVM.EventBus.fireEvent('addConfigParameters',this.configParameters);
	},

	
	/**
	 * Init method
	 * Parameters:
	 * {Object} Reader
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readConfig();
	}
});
