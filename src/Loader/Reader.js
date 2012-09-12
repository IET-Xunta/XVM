/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * @requires XVM.js
 */

/**
 * Reader class reads yaml files and GET petitions and returns object 
 * with their values
 */

XVM.Loader.Reader = function() {
		
	/**
	 * Property
	 * {Object}
	 * Object with configuration
	 */
	this.parameters = {
		'general':{},
		'map_settings':{},
		'view_settings': {}
	};
	
	/**
	 * Parse a YAML file and save response into object
	 * attribute
	 *  
	 * Method
	 * Parameters: 
	 * {String} path to YAML file
	 */
	this.read = function(path) {
		this._call(path,
			function(response, data) {
				var responseObject = jsyaml.load(response);
				var _this = data.context;
				for (var group in responseObject) {
					for (var option in responseObject[group]) {
						console.log(_this.parameters);
						_this.parameters[group][option] = responseObject[group][option];
					}
				}				
			}, 'text');
	}
	
	/**
	 * Private method to send AJAX petitions
	 * 
	 * Method
	 * Parameters:
	 * {String} URL 
	 * {Object} with AJAX parameters
	 * 
	 */
	this._call = function(url, callBack, datatype) {
		$.ajax({
			type : 'GET',
			url : url,
			dataType : datatype,
			context: this,
			success : function(response) {
				callBack(response, this);
			},
			error : function(xhr, textStatus, errorThrown) {
				// TODO when error?
			}
		});
	}

}
