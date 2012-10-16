/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Loader.Reader tests
 */
describe('Reader tests', function() {

	var fakeURL = '?urlconfig=fakeurlconfig&map_settings.EPSG=30000&layers.URLWMS=fakeURLWMS&layers.LAYERID=fakeLayerID';
	fakeURL += '&layers.LAYERTITLE=fakeLayerTitle&layers.INFOFORMAT=fakeInfoFormat&general.LANG=chi&view_settings.BBOX=1,2,3,4';

	var reader;
	var context;
	var fakeContext = function(reader){
		this.response = null;
		this.fromGETParameters = null;
		this.reader = null;
		this.init = function(reader) {
			this.reader = reader;
		};
		this.init(reader);
	};
	var expectedResponse = {
		general: {
			lang: 'es',
			height_map: 300,
			width_map: 300
		}, map_settings: {
			epsg: 'EPSG:23029',
			tile_size: [ 512, 512 ],
			units: 'm',
			bounds: [ 460000, 4625000, 690000, 4855000 ],
			resolutions: [ 611.4962262814, 305.7481131407, 152.8740565704,
			               76.4370282852, 38.2185141426, 19.1092570713,
			               9.5546285356, 4.7773142678, 2.3886571339,
			               1.194328567, 0.5971642835, 0.2985821417 ]
		}, view_settings: {
			bbox: [ 460000, 4625000, 690000, 4855000 ],
			zoom_level: 5,
			center: { lat: 0, lon: 0 }
		}
	};

	beforeEach(function() {
		reader = new XVM.Loader.Reader();
		context = new fakeContext(reader);
		spyOn(XVM.Util, 'getLocationSearch').andReturn(fakeURL);
	});

	it('Reading parameters from URL', function() {
		reader.getParamsFromURL(context);
		expect(context.fromGETParameters.urlconfig).toEqual('fakeurlconfig');
	});

	describe('Reading parameters from files', function() {

		it('Function _call', function() {
			reader._call('spec/aux/map.options.yaml', function(response, context){
				context.response = response;
			}, 'text', context);
			waitsFor(function() {
			      return context.response != null;
			    }, "CallBack function never called", 10000);
			runs(function () {
				expect(context.response).toEqual(expectedResponse);
			});
		});

		it('Function readFromFile', function() {
			reader.readFromFile('spec/aux/map.options.yaml', function(response, context){
				context.response = response;
			}, context);
			waitsFor(function() {
			      return context.response != null;
			    }, "CallBack function never called", 10000);
			runs(function () {
				expect(context.response).toEqual(expectedResponse);
			});
		});

	});

	it('Reading scripts', function() {
		reader.loadScript('spec/aux/FakeMousePosition/FakeMousePosition.js', function(response, context) {
				eval('context.response = new XVM.Control.FakeMousePosition();');
			}, context);
		waitsFor(function() {
		      return context.response != null;
		    }, "CallBack function never called", 10000);
		runs(function () {
			expect(context.response instanceof XVM.Control).toEqual(true);
		});
	});
});
