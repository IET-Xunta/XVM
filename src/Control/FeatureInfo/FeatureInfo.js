/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.FeatureInfo = XVM.Control.extend({

    addToPanel : true,

    createControl : function() { 
        this.OLControl = new OpenLayers.Control.WMSGetFeatureInfo(this.options);
    },

    beforeAddingControl : function() {
        // layers parameter of WMSGetFeatureInfo should be set here, or in addControl or afterAddingControl
        //this.urlWMS = "http://six.agri.local/arcgis/services/Viticola/MapServer/WMSServer";
    },

    afterAddingControl : function() {
        // layers parameter of WMSGetFeatureInfo should be set here, or in addControl or beforeAddingControl
        this.OLControl.events.register('getfeatureinfo', this, this.showsFeatureInfo);

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
                } else {
                    this.featureInfoSetURL();
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
    },
    
    /**
     * Format response of the getFeatureInfo request
     */
    formatInfo : function(features) {
        var html = '<table class="feat_info ui-widget">';
        if (features && features.length) {
            for (var i = 0, len = features.length; i < len; i++) {
                var feature = features[i];
                var attributes = feature.attributes;
                if (feature.layer == null) {
                    feature.layer = new OpenLayers.Layer.WMS();
                    feature.layer.name = feature.type;
                    if (!feature.layer.name) {
                        feature.layer.name = '';
                    }
                    if (feature.gml && feature.gml.featureType) {
                        feature.layer.name = feature.gml.featureType;
                    }
                }
                html += '<tr><th colspan="2" class="ui-widget-header ui-state-active feat_header">' +
                //$.i18n.prop("layer")+': ' + feature.layer.name + "</th><th></th><tr>";
                " Layer:" + feature.layer.name + "</th><th></th><tr>";
                for (var k in attributes) {
                    html += '<tr><th class="ui-widget-content ui-state-default attr_col">' + 
                        k.replace(/_/gi, ' ') + '</th>' + '<td class="ui-widget-content value_col">' + attributes[k] + '</td></tr>';
                }
            }
        }
        return html += '</table>';
    },

    /**
     * Format response of the getFeatureInfo request (special for Geomedia MapServer)
     */
    formatGeomediaInfo : function(response) {
        var xmlFormat = new OpenLayers.Format.XML();
        var doc = xmlFormat.read(response);
        var nodesLayer = xmlFormat.getElementsByTagNameNS(doc, "*", "Layer");
        var features = new Array();
        var pieces = [];

        if (nodesLayer.length == 0) {
            //contents = $.i18n.prop("features_not_found");
            contents = "features_not_found";
            return contents;
        };

        for (var i = 0; i < nodesLayer.length; ++i) {
            var n = nodesLayer[i];    
            var lyrName = n.attributes[0].value;
            pieces.push(lyrName);
            var nodesAttr = xmlFormat.getElementsByTagNameNS(n, "*", "Attribute");
            var layer = new OpenLayers.Layer.Vector(lyrName);
            layer.name = lyrName;
            var data = new Array();
            for (var j = 0; j < nodesAttr.length; ++j) {
                nAtt = nodesAttr[j];
                pieces.push(xmlFormat.write(nAtt));
                data[nAtt.attributes[0].value] = nAtt.textContent;
            }
            var feature = new OpenLayers.Feature.Vector(layer, data, null);
            //  feature.attributes = data;
            feature.layer = layer;
            features.push(feature);
        }
        return features;
    },

    getError : function(text) {
    	var html = '';
        var reader = new OpenLayers.Format.OGCExceptionReport();
        var exceptionReports = reader.read(text);
        if (exceptionReports.exceptionReport != undefined) {
        	html = '<p>';
            var exceptions = exceptionReports.exceptionReport.exceptions;
            for (var i=0; i<exceptions.length; i++ ) {
              	for (var attr in exceptions[i]) {
               		html = html + '<span id=getfeaureinforesponse_' + attr + '>' +
               		attr + ' : ' + exceptions[i][attr] + '</span></br>';
               	}
            };
            html = html + '</p>';
        }
        return html;
    },

    /**
     * Method
     * Parameters:
     * {OpenLayers.Event}
     */
    showsFeatureInfo : function(evt) {
    	var contents = '';
    	if (this.OLControl.url != null) {
    	      contents = this.getError(evt.text);
    	        if (contents == '') {
    	        	var features = null;
    	            if (this.OLControl.infoFormat == 'application/vnd.ogc.gml') {
    	                features = this.OLControl.format.read(evt.text);
    	            } else if (this.OLControl.infoFormat == 'text/xml') {
    	                features = this.formatGeomediaInfo(evt.text);
    	            } 
    	            if (features && features.length > 0) {
    	                contents = this.formatInfo(features);
    	            } else {
    	                contents = evt.text;
    	            } 
    	        }	
    	} else {
    		contents = 'Ninguna capa seleccionada responde a GetFeatureInfo';
    	}    	

        this.OLMap.addPopup(
        		new OpenLayers.Popup.FramedCloud("chicken", 
        				this.OLMap.getLonLatFromPixel(evt.xy), 
        				null, 
        				contents, 
        				null, 
        				true));	
  
    }
});

//@ sourceURL=FeatureInfo.js
