/**
 * 
 */

describe('FeatureInfo control tests', function() {
	
		var wmsLayers = [
			new OpenLayers.Layer.WMS("Subterraneas",
					"http://visorgis.cmati.xunta.es/geoserver/dhgc/wms?", {
						// GetMap parameters
						layers : "masasaugasubterraneas",
						transparent : true,
						format : "image/png"
					}, {
						isBaseLayer : false,
						visibility : true,
						singleTile : false,
						opacity : 1,
						transitionEffect : 'resize',
						buffer : 0,
						layer_position : 201,
						queryable : true
					}),
			new OpenLayers.Layer.WMS("Paixase",
					"http://ideg.xunta.es/wms_paisaxe/request.aspx?", {
						// GetMap parameters
						layers : "ComarcasPaisaxisticas",
						transparent : true,
						format : "image/png"
					}, {
						isBaseLayer : false,
						visibility : true,
						singleTile : false,
						opacity : 1,
						transitionEffect : 'resize',
						buffer : 0,
						layer_position : 202,
						queryable : true
					}),
			new OpenLayers.Layer.WMS("IGN Base",
					"http:\/\/www.ign.es\/wms-inspire\/ign-base", {
						// GetMap parameters
						layers : "IGNBaseTodo",
						transparent : true,
						format : "image/png"
					}, {
						isBaseLayer : true,
						visibility : true,
						singleTile : false,
						opacity : 0.75,
						transitionEffect : 'resize',
						buffer : 0
					}),
			new OpenLayers.Layer.WMS("Topogr\u00e1fico-IDEE",
					"http:\/\/www.idee.es\/wms\/MTN-Raster\/MTN-Raster", {
						// GetMap parameters
						layers : "mtn_rasterizado",
						transparent : true,
						format : "image/png"
					}, {
						isBaseLayer : true,
						visibility : false,
						singleTile : false,
						opacity : 0.60,
						transitionEffect : 'resize',
						buffer : 0
					}) ];
		
	var options = {
		init : {
			infoFormat : 'text/xml',
			url : '',
			queryVisible : true,
			title : 'eval($.i18n(\'feature_info_tooltip\'))'
		},
		properties : {
			'en' : {
				'feature_info_tooltip' : 'Feature Info'
			},
			'es' : {
				'feature_info_tooltip' : 'Datos de la entidad'
			},
			'gl' : {
				'feature_info_tooltip' : 'Datos da entidade'
			}
		}
	};
	
	var parameters = getJSONFixture('map.parameters.json');
	
	XVM.EventBus = new XVM.Event.EventBus();
	
	var map = new XVM.Map('map');
	map.addConfigParameters(parameters);
	map.addLayers(wmsLayers);
	map.addControls([]);
	
	var infoFeature = new XVM.Control.FeatureInfo(options, '', 1);
	infoFeature.setOLMap(map.OLMap);
	
	infoFeature.featureInfoSetURL();
	
	beforeEach(function() {
		
	});
	
	it('Control sets last url valid layer', function() {
		expect(infoFeature.OLControl.url).toEqual(wmsLayers[1].url);
		wmsLayers[0].queryable = true;
		wmsLayers[1].queryable = false;
		infoFeature.featureInfoSetURL();
		expect(infoFeature.OLControl.url).toEqual(wmsLayers[0].url);
		wmsLayers[0].queryable = false;
		wmsLayers[1].queryable = false;
		infoFeature.featureInfoSetURL();
		expect(infoFeature.OLControl.url).toBeNull();
	});
	
});