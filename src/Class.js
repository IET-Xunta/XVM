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

XVM.Class = function() {
}

XVM.Class.prototype.construct = function() {
};

XVM.Class.extend = function(def) {
	var classDef = function() {
		if(arguments[0] !== XVM.Class) {
			this.construct.apply(this, arguments);
		}
	};

	var proto = new this(XVM.Class);
	var superClass = this.prototype;

	for(var n in def) {
		var item = def[n];
		if( item instanceof Function)
			item.$ = superClass;
		proto[n] = item;
	}

	classDef.prototype = proto;

	//Give this new class the same static extend method
	classDef.extend = this.extend;
	return classDef;
}; 