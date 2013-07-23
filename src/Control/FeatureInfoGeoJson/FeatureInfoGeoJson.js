/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.FeatureInfoGeoJson = XVM.Control.extend({

    addToPanel : true,

    customOLControlFile : 'OLFeatureInfoGeoJson.js',

    createControl : function() { 
        this.OLControl = new XVM.Control.OLFeatureInfoGeoJson(this.options);
    },

    afterAddingControl : function() {
        // Try to change dinamically the url to use depending on the layer visibility
        // NOTE: XVM allows the 'queryable' parameter on the map.layers.yaml file
        XVM.EventBus.addListener(this, 'selectLayerInfo', 'changelayer');
        XVM.EventBus.addListener(this, 'afterMapReady', 'mapCompleted');
    },
    
    afterMapReady : function(){
        this.featureInfoSetURL();  
    },
    
    selectLayerInfo : function(evt) {
    	this.OLControl.url = null;
        if (evt.property === "visibility") {
            if (evt.layer.isBaseLayer == false) {
                if (evt.layer.visibility == true) {
                	this.OLControl.url = evt.layer.url;
                } 
            }
        }
    },
    
    featureInfoSetURL : function() {
        var lyrs_aux = this.OLMap.getLayersBy("visibility", true);
        this.OLControl.url = null;
        for (var i = 0; i < lyrs_aux.length; i++) {
            var l = lyrs_aux[i];
            if (l.isBaseLayer == false && l.url  
                && (l.queryable == undefined || l.queryable)) {
            	this.OLControl.url = l.url;
            } 
        }
    }
});