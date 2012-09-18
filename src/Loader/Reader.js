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
 * Reader class reads yaml files and GET petitions and returns object 
 * with their values
 */

XVM.Loader.Reader = function() {
	
	/**
	 * AJAX context
	 * Property
	 */
	this.context = null;
	
	/**
	 * 
	 */
	this.setContext = function(context) {
		this.context = context;
	}

	/**
	 * Parse a YAML file and save response into object
	 * attribute
	 *  
	 * Method
	 * Parameters: 
	 * {String} path to YAML file
	 */
	this.readFromFile = function(path, callBack) {
		this._call(path,
			callBack,
			'text');
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
			context : this.context,
			dataType : datatype,
			success : function(response) {
				var responseObject = jsyaml.load(response);
				callBack(responseObject, this);
			},
			error : function(xhr, textStatus, errorThrown) {
				// TODO when error?
			}
		});
	}

}
