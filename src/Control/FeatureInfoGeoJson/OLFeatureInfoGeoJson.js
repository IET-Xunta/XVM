/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 *
 * Based on OpenLayers.Control.WMSGetFeatureInfo...
 * [Xeovisor minimo - XVM]: modified for requesting data from the layer itself.
 * 
 * Also created a new popup based on the OpenLayers.Popup.FramedCloud one.
 */

XVM.DestroyableFramedCloud = 
  OpenLayers.Class(OpenLayers.Popup.FramedCloud, {

    /** 
     * Property: contentDisplayClass
     * {String} The CSS class of the popup content div.
     */
    contentDisplayClass: "olFramedCloudPopupContent xvmDestroyableFramedCloudPopupContent",

    /**
     * Instead of hiding the widget when closing, we destroy it.
     */
    hide: function() {
    	this.destroy();
    },

    CLASS_NAME: "XVM.DestroyableFramedCloud"
});

XVM.Control.OLFeatureInfoGeoJson = OpenLayers.Class(OpenLayers.Control, {

   /**
     * APIProperty: hover
     * {Boolean} Send GetFeatureInfo requests when mouse stops moving.
     *     Default is false.
     */
    hover: false,
    
    noDataMessage: 'No features to inspect',

    /**
     * APIProperty: clickCallback
     * {String} The click callback to register in the
     *     {<OpenLayers.Handler.Click>} object created when the hover
     *     option is set to false. Default is "click".
     */
    clickCallback: "click",

    /**
     * APIProperty: queryVisible
     * {Boolean} If true, filter out hidden layers when searching the map for
     *     layers to query.  Default is false.
     */
    queryVisible: false,

    /**
     * Property: handler
     * {Object} Reference to the <OpenLayers.Handler> for this control
     */
    handler: null,

    /**
     * Property: hoverRequest
     * {<OpenLayers.Request>} contains the currently running hover request
     *     (if any).
     */
    hoverRequest: null,

    singletonPopup: false,

    lastPopup: null,

    /**
     * APIProperty: events
     * {<OpenLayers.Events>} Events instance for listeners and triggering
     *     control specific events.
     *
     * Register a listener for a particular event with the following syntax:
     * (code)
     * control.events.register(type, obj, listener);
     * (end)
     *
     * Supported event types (in addition to those from <OpenLayers.Control.events>):
     * beforegetfeatureinfo - Triggered before the request is sent.
     *      The event object has an *xy* property with the position of the
     *      mouse click or hover event that triggers the request.
     * nogetfeatureinfo - no queryable layers were found.
     * getfeatureinfo - Triggered when a GetFeatureInfo response is received.
     *      The event object has a *text* property with the body of the
     *      response (String), a *features* property with an array of the
     *      parsed features, an *xy* property with the position of the mouse
     *      click or hover event that triggered the request, and a *request*
     *      property with the request itself. If drillDown is set to true and
     *      multiple requests were issued to collect feature info from all
     *      layers, *text* and *request* will only contain the response body
     *      and request object of the last request.
     */

    /**
     * Constructor: <OpenLayers.Control.WMSGetFeatureInfo>
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        options = options || {};
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);

        if(!this.format) {
            this.format = new OpenLayers.Format.WMSGetFeatureInfo(
                options.formatOptions
            );
        }

        if(this.drillDown === true) {
            this.hover = false;
        }

        if(this.hover) {
            this.handler = new OpenLayers.Handler.Hover(
                   this, {
                       'move': this.cancelHover,
                       'pause': this.getInfoForHover
                   },
                   OpenLayers.Util.extend(this.handlerOptions.hover || {}, {
                       'delay': 250
                   }));
        } else {
            var callbacks = {};
            callbacks[this.clickCallback] = this.getInfoForClick;
            this.handler = new OpenLayers.Handler.Click(
                this, callbacks, this.handlerOptions.click || {});
        }
    },

    /**
     * Method: getInfoForClick
     * Called on click
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     */
    getInfoForClick: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        // Set the cursor to "wait" to tell the user we're working on their
        // click.
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy, {});
    },

    /**
     * Method: getInfoForHover
     * Pause callback for the hover handler
     *
     * Parameters:
     * evt - {Object}
     */
    getInfoForHover: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        this.request(evt.xy, {hover: true});
    },

    /**
     * Method: cancelHover
     * Cancel callback for the hover handler
     */
    cancelHover: function() {
        if (this.hoverRequest) {
            this.hoverRequest.abort();
            this.hoverRequest = null;
        }
    },

    /**
     * Method: findLayers
     * Internal method to get the Vector layers from the map
     */
    findLayers: function() {

        var candidates = this.layers || this.map.layers;
        var layers = [];
        var layer;
        for(var i = candidates.length - 1; i >= 0; --i) {
            layer = candidates[i];
            if(layer instanceof OpenLayers.Layer.Vector &&
               (!this.queryVisible || layer.getVisibility())) {
                layers.push(layer);
            }
        }
        return layers;
    },

    /**
     * Method: request
     * Requests the attributes from the Vector layers
     *
     * Parameters:
     * clickPosition - {<OpenLayers.Pixel>} The position on the map where the
     *     mouse event occurred.
     * options - {Object} additional options for this method.
     *
     * TODO Valid options:
     * - *hover* {Boolean} true if we do the request for the hover handler
     */
    request: function(clickPosition, options) {
        var layers = this.findLayers();
        if(layers.length == 0) {
            this.events.triggerEvent("nogetfeatureinfo");
            // Reset the cursor.
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            return;
        }
        this.displayInfo(clickPosition, layers);
    },

    /**
     * Method: displayInfo
     * Display a dialog with the layers info.
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} The position on the map where the
     *     mouse event occurred.
     * layers - {[<OpenLayers.Layer>]} The layers we must check.
     */
    displayInfo: function(xy, layers) {

    	var lonlat = this.map.getLonLatFromPixel(xy);
        geomFilter = new OpenLayers.Filter.Spatial({  
  	      type: OpenLayers.Filter.Spatial.INTERSECTS,  
  	      property: 'geometry',  
  	      value: new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),  
  	      projection: this.map.getProjection()
  	    });

        var data = '';
        for (i=0, len=layers.length; i<len; i++) {
        	data += this.getDataForLayer(geomFilter, layers[i]);
        }
        if (data != '') {
            data = '<ul>' + data + '</ul>';
        } else {
        	data = '<i>' + this.noDataMessage + '</i>';
        }
        popup = new XVM.DestroyableFramedCloud('VectorFeatureInfo',
                lonlat,
                new OpenLayers.Size(250,120),
                data,
                null,
                true);
        if (this.singletonPopup) {
	        if (this.lastPopup != null) {
	        	this.lastPopup.destroy();
	        }
	        this.lastPopup = popup;
        }
		popup.setBackgroundColor("#bcd2ee");
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
		this.map.addPopup(popup);
    },
    
    /**
     * Method: getDataForLayer
     * Returns an HTML with the layer features data that match the given filter.
     *
     * Parameters:
     * filter - {<OpenLayers.Filter>} The filter we want the features to comply with.
     * layer - {<OpenLayers.Layer>} The layer we must check.
     */
    getDataForLayer: function(filter, layer) {
    	var data = '', feature;
    	for (j=0, leng=layer.features.length; j<leng; j++) {
    		feature = layer.features[j];
    		if (geomFilter.evaluate(feature)) {
    			for (a in feature.attributes) {
    				if (data == '') {
    					data = '<li><b>' + layer.name + '</b>:<ul>';
    				}
    				data += '<li>' + a + ': ' + feature.attributes[a] + '</li>';
    			}
    		}
    	}
    	if (data != '') {
    		data += '</ul></li>';
    	}
    	return data;
    },

    CLASS_NAME: "XVM.Control.OLFeatureInfoGeoJson"
});
