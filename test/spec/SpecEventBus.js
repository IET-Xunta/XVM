/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
*/

/**
 * XVM.Event.EventBus tests
 */

describe('EventBus tests', function() {

	mockListener1 = function() {
		this.arg = 0;
		this.mockFunction1 = function(param) {
		};
		this.mockFunction2 = function(param) {
			this.arg = param;
		};
	};
	mockListener2 = function() {
		this.arg = 0;
		this.mockFunction1 = function(param) {
		};
		this.mockFunction2 = function(param) {
			this.arg = param;
		};
	};

	beforeEach(function() {
		eventbus = new XVM.Event.EventBus();
		mock1 = new mockListener1();
		mock2 = new mockListener2();
	});
	
	describe('Registering listeners', function() {

		it('Listeners list starts void', function() {
			expect(eventbus.listeners.event1).toBeUndefined();
		});

		it('Registering one listener', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			expect(eventbus.listeners.event1.length).toEqual(1);
			expect(eventbus.listeners.event1).toContain([mock1, 'mockFunction1']);
		});

		it('Registering two listeners for the same event', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			expect(eventbus.listeners.event1.length).toEqual(2);
			expect(eventbus.listeners.event1).toContain([mock1, 'mockFunction1']);
			expect(eventbus.listeners.event1).toContain([mock2, 'mockFunction1']);
		});

		it('Registering two listeners for the same event and two new listeners for another one', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			eventbus.addListener(mock1, 'mockFunction2', 'event2');
			eventbus.addListener(mock2, 'mockFunction2', 'event2');
			expect(eventbus.listeners.event2.length).toEqual(2);
			expect(eventbus.listeners.event2).toContain([mock1, 'mockFunction2']);
			expect(eventbus.listeners.event2).toContain([mock2, 'mockFunction2']);
			expect(eventbus.listeners.event1.length).toEqual(2);
			expect(eventbus.listeners.event1).toContain([mock1, 'mockFunction1']);
			expect(eventbus.listeners.event1).toContain([mock2, 'mockFunction1']);
		});

	});
	
	describe('Raising events', function() {

		beforeEach(function() {
			spyOn(mock1, 'mockFunction1');
			spyOn(mock2, 'mockFunction1');
			spyOn(mock1, 'mockFunction2').andCallThrough();
			spyOn(mock2, 'mockFunction2').andCallThrough();
		});

		it('Raising an event without listeners', function() {
			eventbus.fireEvent('event1', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(0);
			expect(mock1.mockFunction2.calls.length).toEqual(0);
			expect(mock1.arg).toEqual(0);
			expect(mock2.mockFunction1.calls.length).toEqual(0);
			expect(mock2.mockFunction2.calls.length).toEqual(0);
			expect(mock2.arg).toEqual(0);
		});

		it('Registering a listener and raising the event', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.fireEvent('event1', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args[0]).toEqual(1);
			expect(mock1.mockFunction2.calls.length).toEqual(0);
			expect(mock1.arg).toEqual(0);
			expect(mock2.mockFunction1.calls.length).toEqual(0);
			expect(mock2.mockFunction2.calls.length).toEqual(0);
			expect(mock2.arg).toEqual(0);
		});

		it('Registering two listeners for the same event and raising it', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			eventbus.fireEvent('event1', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args[0]).toEqual(1);
			expect(mock1.mockFunction2.calls.length).toEqual(0);
			expect(mock1.arg).toEqual(0);
			expect(mock2.mockFunction1.calls.length).toEqual(1);
			expect(mock2.mockFunction1.mostRecentCall.args.length).toEqual(1);
			expect(mock2.mockFunction1.mostRecentCall.args[0]).toEqual(1);
			expect(mock2.mockFunction2.calls.length).toEqual(0);
			expect(mock2.arg).toEqual(0);
		});

		it('Registering two listeners for the same event, another for a different one with a method that changes the object state and raising the latest', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			eventbus.addListener(mock1, 'mockFunction2', 'event2');
			eventbus.fireEvent('event2', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(0);
			expect(mock1.mockFunction2.calls.length).toEqual(1);
			expect(mock1.mockFunction2.mostRecentCall.args.length).toEqual(1);
			expect(mock1.mockFunction2.mostRecentCall.args[0]).toEqual(1);
			expect(mock1.arg).toEqual(1);
			expect(mock2.mockFunction1.calls.length).toEqual(0);
			expect(mock2.mockFunction2.calls.length).toEqual(0);
			expect(mock2.arg).toEqual(0);
		});

		it('Registering two listeners for the same event, two for a different one with a method that changes the object state and raising the latest', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			eventbus.addListener(mock1, 'mockFunction2', 'event2');
			eventbus.addListener(mock2, 'mockFunction2', 'event2');
			eventbus.fireEvent('event2', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(0);
			expect(mock1.mockFunction2.calls.length).toEqual(1);
			expect(mock1.mockFunction2.mostRecentCall.args.length).toEqual(1);
			expect(mock1.mockFunction2.mostRecentCall.args[0]).toEqual(1);
			expect(mock1.arg).toEqual(1);
			expect(mock2.mockFunction1.calls.length).toEqual(0);
			expect(mock2.mockFunction2.calls.length).toEqual(1);
			expect(mock2.mockFunction2.mostRecentCall.args.length).toEqual(1);
			expect(mock2.mockFunction2.mostRecentCall.args[0]).toEqual(1);
			expect(mock2.arg).toEqual(1);
		});

		it('Registering two listeners for the same event, two for a different one with a method that changes the object state and raising the former', function() {
			eventbus.addListener(mock1, 'mockFunction1', 'event1');
			eventbus.addListener(mock2, 'mockFunction1', 'event1');
			eventbus.addListener(mock1, 'mockFunction2', 'event2');
			eventbus.addListener(mock2, 'mockFunction2', 'event2');
			eventbus.fireEvent('event1', 1);
			expect(mock1.mockFunction1.calls.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args.length).toEqual(1);
			expect(mock1.mockFunction1.mostRecentCall.args[0]).toEqual(1);
			expect(mock1.mockFunction2.calls.length).toEqual(0);
			expect(mock1.arg).toEqual(0);
			expect(mock2.mockFunction1.calls.length).toEqual(1);
			expect(mock2.mockFunction1.mostRecentCall.args.length).toEqual(1);
			expect(mock2.mockFunction1.mostRecentCall.args[0]).toEqual(1);
			expect(mock2.mockFunction2.calls.length).toEqual(0);
			expect(mock2.arg).toEqual(0);
		});
	});
});
