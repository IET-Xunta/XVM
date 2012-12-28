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
        this.OLControl = new OpenLayers.Control.WMSGetFeatureInfo({
            infoFormat : "application/vnd.ogc.gml", //infoformat
            url : "",
            queryVisible : true, // just query visible layers
            //title: $.i18n.prop("featureinfo_tooltip"),
            layers : this.layers
        });
    },

    beforeAddingControl : function() {
        //this.urlWMS = "http://six.agri.local/arcgis/services/Viticola/MapServer/WMSServer";
    },

    afterAddingControl : function() {
        this.OLControl.events.register('getfeatureinfo', this, this.showsFeatureInfo);

        // Try to change dinamically the url to use depending on the layer visibility
        // NOTE: XVM allows the 'queryable' parameter on the map.layers.yaml file 
        this.OLMap.events.register('changelayer', null, function(evt) {
            if (evt.property === "visibility") {
                if (evt.layer.isBaseLayer == false) {
                    if (evt.layer.visibility == true) {
                        this.OLControl.url = evt.layer.url;
                    } else {
                        var info_ctl = this.getControlsByClass('OpenLayers.Control.WMSGetFeatureInfo')[0];
                        if (this && info_ctl != undefined) {
                            var lyrs_aux = this.getLayersBy("visibility", true);
                            for (var i = 0; i < lyrs_aux.length; i++) {
                                var l = lyrs_aux[i];
                                if (l.isBaseLayer == false && (l.queryable == undefined || l.queryable)) {
                                    info_ctl.url = l.url;
                                }
                            }
                        } else {
                            //console.log("this.OLMap: " + this.OLMap);
                        }
                    }
                }
            }
        });

    },
    
    /**
     * Format response of the getFeatureInfo request
     */
    formatInfo : function(features) {
        var html = '<table class="feat_info">';
        if (features && features.length) {
            for (var i = 0, len = features.length; i < len; i++) {
                var feature = features[i];
                var attributes = feature.attributes;
                if (feature.layer == null) {
                    feature.layer = new OpenLayers.Layer.WMS()
                    feature.layer.name = feature.type;
                    if (!feature.layer.name) {
                        feature.layer.name = '';
                    }
                    if (feature.gml && feature.gml.featureType) {
                        feature.layer.name = feature.gml.featureType;
                    }
                }
                html += '<tr><th colspan="2" class="feat_header">' +
                //$.i18n.prop("layer")+': ' + feature.layer.name + "</th><th></th><tr>";
                "layer" + ': ' + feature.layer.name + "</th><th></th><tr>";
                for (var k in attributes) {
                    html += '<tr><th class="attr_col">' + k.replace(/_/gi, ' ') + '</th>' + '<td class="value_col">' + attributes[k] + '</td></tr>';
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
        return formatInfo(features);
    },

    getError : function(text) {
        //var html = $.i18n.prop("no_features_found");
        var html = "no_features_found";
        if (text.toUpperCase().indexOf("ERROR") != -1 || text.toUpperCase().indexOf("EXCEPTION") != -1) {
            //html = $.i18n.prop("error_on_getFeatureInfo");
            html = "error_on_getFeatureInfo";
        }
        return html;
    },

    getFeatureInfo : function(urlWMS) {
        getFeatureInfo(urlWMS, 'application/vnd.ogc.gml');
    },

    /**
     * Method
     * Parameters:
     * {OpenLayers.Event}
     */
    showsFeatureInfo : function(evt) {
        var contents = "";
        if (this.OLControl.infoFormat == 'application/vnd.ogc.gml') {
            var features = this.OLControl.format.read(evt.text);
            if (features && features.length > 0) {
                contents = this.formatInfo(features);
            } else {
                //contents = $.i18n.prop("features_not_found");
                contents = "features_not_found";
            }
        } else if (this.featureInfo.infoFormat == 'text/xml') {
            contents = formatGeomediaInfo(e.text);
        } else {
            contents = evt.text;
        }
        ;

        this.OLMap.addPopup(new OpenLayers.Popup.FramedCloud("chicken", this.OLMap.getLonLatFromPixel(evt.xy), null, contents, null, true));
    }
});

// Added for debugging tasks
//@ sourceURL=featureInfo.js