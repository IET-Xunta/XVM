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

function internationalizeObject(object) {
	for(var o in object) {
        if(typeof(object[o]) == 'object'){
        	internationalizeObject(object[o]);
        }else{
        	if ((typeof(object[o]) == 'string') && (object[o].substring(0, 12) == "$.i18n.prop(")) {
        		object[o] = eval(object[o]);
			}
        }
    }
};
