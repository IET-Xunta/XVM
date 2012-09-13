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
 */

/**
 * Config class uses Reader class to access config files trought
 * YAML files, GET Parameters like URLCONFIG or options parameters
 *
 * Reader method list:
 */

XVM.Loader.Config = function(reader) {

	/**
	 * path to defaults config file
	 * Constant
	 */
	this.DEFAULTCONFIG = 'config/map.options.yaml';

	/**
	 * Reader
	 * Property
	 */
	this.reader = null;

	/**
	 * Object saves config parameters
	 * Property
	 * {Object}
	 */
	this.configParameters = {
		'general':{},
		'map_settings':{},
		'view_settings': {}
	};
	
	/**
	 * Object saves GET parameters
	 * Property
	 * {Object}
	 */
	this.fromGETParameters = null;

	this._getQueryParams = function() {
		var qs = XVM.Util.getLocationSearch();
		qs = qs.split("+").join(" ");
		this.fromGETParameters = {};
		var tokens, 
		re = /[?&]?([^=]+)=([^&]*)/g;

		while(tokens = re.exec(qs)) {
			this.fromGETParameters[decodeURIComponent(tokens[1]).toLowerCase()] = decodeURIComponent(tokens[2]);
		}
	};

	this._readConfig = function() {
		this._getQueryParams();
		this.reader.readConfig(this.DEFAULTCONFIG, this._configCallBack);
	};
	
	this._configCallBack = function(responseObject, context) {
		var _this = context;
		for(var group in responseObject) {
			for(var option in responseObject[group]) {
				_this.configParameters[group][option] = responseObject[group][option];
			}
		}
		if(_this.fromGETParameters.urlconfig != undefined) {
			_this.reader.readConfig(_this.fromGETParameters.urlconfig, _this._urlConfigCallBack);			
		} else {
			_this._configGETParameters();
		}

	}
	
	this._urlConfigCallBack = function(responseObject, context) {
		var _this = context;
		$.extend(_this.configParameters, responseObject);
		_this._configGETParameters();		
	}
	
	this._configGETParameters = function() {
		for(var group in this.configParameters) {
			for(var parameter in this.configParameters[group]) {
				if(this.fromGETParameters[parameter] != undefined)
					this.configParameters[group][parameter] = this.fromGETParameters[parameter];
			}
		}
	}

	
	/**
	 * Init method
	 * Parameters:
	 * {Object} Reader
	 */
	this.init = function(reader) {
		this.reader = reader;
		reader.setContext(this);
		this._readConfig();
	};

	this.init(reader);
};
