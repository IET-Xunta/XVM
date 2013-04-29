/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.CustomLayerSwitcher = XVM.Control.extend({

	customOLControlFile : 'OLCustomLayerSwitcher.js',

    createControl : function() { 
        this.OLControl = new XVM.Control.OLCustomLayerSwitcher(this.options);
    }
});
