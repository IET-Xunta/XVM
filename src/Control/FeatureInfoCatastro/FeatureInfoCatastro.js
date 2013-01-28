/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */

XVM.Control.FeatureInfoCatastro = XVM.Control.extend({

    addToPanel : true,

    createControl : function() {
        this.OLControl = new OpenLayers.Control.WMSGetFeatureInfo({
            infoFormat : 'application/vnd.ogc.gml',
            displayClass : "olControlFeatureCatastroInfo",
            url : 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?'
        });

        this.OLControl.events.on({
            getfeatureinfo : function(e) {
                var features = this.format.read(e.text);
                var lonlat = XVM.map.OLMap.getLonLatFromPixel(e.xy);
                if (features && features.length > 0) {
                    //document.getElementById("output").innerHTML = formatInfo(features);
                    map.addPopup(new OpenLayers.Popup.FramedCloud("chicken", lonlat, null, catastroFormatInfo(features), null, true));
                } else {
                    var a = $(e.text).find("a").first().attr("target", "_blank");
                    text = '<p><img src="http://www.catastro.minhap.es/images_2011/logo_mhap2.gif" width="200px"/></p>';
                    text = $(text).append("<p> Referencia Catastral: <br> </p>");                    
                    text = $(text).append(a[0]);
                    XVM.map.OLMap.addPopup(new OpenLayers.Popup.FramedCloud("chicken", lonlat, null,
                    //text.html(),
                    text.html(), null, true));
                }
            }
        });
    },
    beforeAddingControl : function() {
        // layers parameter of WMSGetFeatureInfo should be set here, or in addControl or afterAddingControl
        //this.urlWMS = "http://six.agri.local/arcgis/services/Viticola/MapServer/WMSServer";
    },

    afterAddingControl : function() {
        // // layers parameter of WMSGetFeatureInfo should be set here, or in addControl or beforeAddingControl
        // this.OLControl.events.register('getfeatureinfo', this, this.showsFeatureInfo);
        //
        // // Try to change dinamically the url to use depending on the layer visibility
        // // NOTE: XVM allows the 'queryable' parameter on the map.layers.yaml file
        // this.OLMap.events.register('changelayer', null, select_layer_info);
        // XVM.EventBus.addListener(this, 'afterMapReady', 'mapCompleted');
        // },
        //
        // afterMapReady : function(){
        // featureInfo_setURL();
    },

    /**
     * Format response of the getFeatureInfo request
     */
    catastroFormatInfo : function(features) {
        var html = '<table class="feat_info">';
        if (features && features.length) {
            for (var i = 0, len = features.length; i < len; i++) {
                var feature = features[i];
                var attributes = feature.attributes;
                html += '<tr><th colspan="2" class="feat_header">' + $.i18n.prop("layer") + ': ' + feature.type + "</th><th></th><tr>";
                for (var k in attributes) {
                    html += '<tr><th class="attr_col">' + k.replace(/_/gi, ' ') + '</th><td class="value_col">' + attributes[k] + '</td></tr>';
                }
            }
        } else {
            return features;
        }
        return html += '</table>';
    }
});

// Added for debugging tasks
//@ sourceURL=featureCatastroInfo.js