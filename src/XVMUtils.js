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

function evalObject(object) {
	for(var o in object) {
        if(typeof(object[o]) == 'object'){
        	evalObject(object[o]);
        } else {
            if ((typeof(object[o]) == 'string') && (object[o].substring(0, 5) == "eval(") && (object[o].substring(object[o].length-1) == ")")) {
                object[o] = eval(object[o].substring(5, object[o].length-1));
            }
        }
    }
};
