/**
 * @requires Control.js
 */

/**
 */
XVM.Control.FooControl = XVM.Control.extend({
	
	/**
	 * FooControl Variables
	 */
        FooControlVariable: null,    

        /**
	 * Method: createControl
	 */
	createControl : function() {
            //Options from the FooControl.yaml
            var FooControl_options = this.options;
	    this.OLControl = new OpenLayers.Control();
	    XVM.EventBus.addListener(this, 'FooControlListener', 'FooControlEvt');
	},

	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
	}

});
//@ sourceURL=FooControl.js

