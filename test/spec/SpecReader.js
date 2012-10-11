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
	
	var fakeURL = '?urlconfig=fakeurlconfig&map_settings.EPSG=30000&layers.URLWMS=fakeURLWMS&layers.LAYERID=fakeLayerID'
	fakeURL += '&layers.LAYERTITLE=fakeLayerTitle&layers.INFOFORMAT=fakeInfoFormat&general.LANG=chi&view_settings.BBOX=1,2,3,4'
	
	var reader;
	var fakeContext = function(reader){
		this.fromGETParameters = null
		this.reader = null;
		this.init = function(reader) {
			this.reader = reader;
		}
		
		this.init(reader);
	}
	beforeEach(function() {
		reader = new XVM.Loader.Reader();
		spyOn(XVM.Util, 'getLocationSearch').andReturn(fakeURL);
	});
	
	it('Reads parameters from URL', function() {
		var context = new fakeContext(reader);
		reader.getParamsFromURL(context);
		expect(context.fromGETParameters.urlconfig).toEqual('fakeurlconfig');
	});
});
