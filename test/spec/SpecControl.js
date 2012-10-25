/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Map tests
 */

describe('Control tests', function() {

	WrongControl = XVM.Class.extend({
		initialize : function() {
		}
	});

	MockControl1 = XVM.Control.extend({
		initialize : function() {
		}
	});

	MockControl2 = XVM.Control.extend({
		map : null,
		initialize : function() {
		},
		setOLMap : function(map) {
			this.map = map;
		}
	});

	beforeEach(function() {
		wrong = new WrongControl();
		mock1 = new MockControl1();
		mock2 = new MockControl2();
	});

	it('Control general inheritance test', function() {
		expect(wrong instanceof XVM.Control).toBe(false);
		expect(mock1 instanceof XVM.Control).toBe(true);
	});

	it('Control methods inheritance test', function() {
		mock1Result = function() {
			mock1.setOLMap('map');
		};
		mock2Result = function() {
			mock2.setOLMap('map');
		};
		expect(mock1Result).toThrow();
		expect(mock2Result).not.toThrow();
		expect(mock2.map).toEqual('map');
	});
});