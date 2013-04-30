/**
 * 
 */

describe('FeatureInfo control tests', function() {

		var wmsLayer1 = new OpenLayers.Layer.WMS("Catastro",
							"http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx", {
							// GetMap parameters
							layers : "Catastro",
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
						});

		var wmsLayer2 = new OpenLayers.Layer.WMS("Paixase",
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
						});

		var wmsLayer3 = new OpenLayers.Layer.WMS("IGN Base",
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
						});

		var wmsLayer4 = new OpenLayers.Layer.WMS("Topogr\u00e1fico-IDEE",
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
						});
		var wmsLayers = [wmsLayer1, wmsLayer2, wmsLayer3, wmsLayer4];
		
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
	
	var fakeerrortext = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + 
	'<!DOCTYPE ServiceExceptionReport SYSTEM "http://fakeurl/schemas/wms/1.1.1/WMS_exception_1_1_1.dtd">' + 
	' <ServiceExceptionReport version="1.1.1" >   <ServiceException code="InvalidFormat" locator="info_format"> ' + 
	'     Invalid format &apos;text/xml&apos;, supported formats are [text/plain, application/vnd.ogc.gml, text/html]' + 
	'</ServiceException></ServiceExceptionReport>';
	
	var fakeTextGetFeatureInfo = '"<?xml version="1.0" encoding="ISO-8859-1"?>' + 
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + 
	'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="sp" lang="sp"> ' + 
	'<head><title>Informaci&oacute;n parcelas</title></head><body><p>Referencia catastral de la parcela:</p><p>' + 
	'<a href="https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?del=27&muni=900&rc1=27900B5&rc2=0100134">27900B50100134</a></p></body></html>';
	
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
		expect(infoFeature.OLControl.url).toEqual(wmsLayer2.url);
		wmsLayer1.queryable = true;
		wmsLayer2.queryable = false;
		wmsLayers = [wmsLayer1, wmsLayer2, wmsLayer3, wmsLayer4];
		XVM.EventBus = new XVM.Event.EventBus();
		infoFeature = new XVM.Control.FeatureInfo(options, '', 1);
		infoFeature.setOLMap(map.OLMap);
		map = new XVM.Map('map');
		map.addConfigParameters(parameters);
		map.addLayers(wmsLayers);
		map.addControls([]);
		infoFeature.featureInfoSetURL();
		expect(infoFeature.OLControl.url).toEqual(wmsLayer1.url);
		wmsLayer1.queryable = false;
		wmsLayer2.queryable = false;
		wmsLayers = [wmsLayer1, wmsLayer2, wmsLayer3, wmsLayer4];
		XVM.EventBus = new XVM.Event.EventBus();
		infoFeature = new XVM.Control.FeatureInfo(options, '', 1);
		infoFeature.setOLMap(map.OLMap);
		map = new XVM.Map('map');
		map.addConfigParameters(parameters);
		map.addLayers(wmsLayers);
		map.addControls([]);
		infoFeature.featureInfoSetURL();
		expect(infoFeature.OLControl.url).toBeNull();
	});
	
	it('Changes layer visibility control sets new URL', function(){
		var evt = {
				property : 'visibility',
				layer : wmsLayer2
		};
		XVM.EventBus.fireEvent('changelayer', evt);
		expect(infoFeature.OLControl.url).toEqual(wmsLayer2.url);
		evt.layer = wmsLayer3;
		XVM.EventBus.fireEvent('changelayer', evt);
		expect(infoFeature.OLControl.url).toBeNull();
		evt.layer = wmsLayer1;
		XVM.EventBus.fireEvent('changelayer', evt);
		expect(infoFeature.OLControl.url).toEqual(wmsLayer1.url);
	});
	
	it('Feature gets error shows message', function() {
		var html = infoFeature.getError(fakeerrortext);
		expect($(html).find('#getfeaureinforesponse_code').text()).toEqual('code : InvalidFormat');
	});
	
	it('Shows feature info from layer', function() {
		var fakeGetfeatureInfoEvent = {
				cancelBubble : true,
				element : null,
				features : new Array(),
				object : infoFeature.OLControl,
				request : null, 
				text : fakeTextGetFeatureInfo,
				type : 'getfeatureinfo',
				xy : new OpenLayers.Pixel(529, 221)
		};
		spyOn(infoFeature.OLMap, 'addPopup');
		infoFeature.showsFeatureInfo(fakeGetfeatureInfoEvent);
		expect(infoFeature.OLMap.addPopup).toHaveBeenCalled();
	});
	
});