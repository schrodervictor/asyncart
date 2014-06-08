var Controller = require('../engine/Controller.class');
describe('Controller class', function() {
	it('should creat a new Controller', function(next) {
		var controller = new Controller();
//		var child = Controller.extend({name: 'Basic Controller'});
		expect(controller.extend).toBeDefined();
		expect(controller.run).toBeDefined();
//		expect(child.name).toBe('Basic Controller');
		next();
	});
	it('should be extensible', function(next) {
		var controller = new Controller();
		var OtherController = controller.extend({
			newProperty: 'Value1',
			newMethod: function() { }
		});
		var otherController = new OtherController();

		var controller2 = new Controller();
		var OtherController2 = controller2.extend({
			newProperty: 'Value2',
			newSecondMethod: function() { }
		});
		var otherController2 = new OtherController2();
		
		expect(otherController.run).toBeDefined();
		expect(otherController.newProperty).toBe('Value1');
		expect(otherController.newMethod).toBeDefined();
		expect(otherController.newSecondMethod).not.toBeDefined();

		expect(otherController2.run).toBeDefined();
		expect(otherController2.newProperty).toBe('Value2');
		expect(otherController2.newSecondMethod).toBeDefined();
		expect(otherController2.newMethod).not.toBeDefined();
		
		expect(controller.newProperty).not.toBeDefined();
		expect(controller.newMethod).not.toBeDefined()
		expect(controller.newSecondMethod).not.toBeDefined();
		
		next();
	});
	it('the childs should be extensible', function(next) {
		var controller = new Controller();
		var OtherController3 = controller.extend({
			oldProperty: 'Old value 1',
			newProperty: 'Value3',
			run: function() {
				return 'Run Controller 3';
			},
			newThirdMethod: function() {
				return 'Return 3';
			}
		});
		var otherController3 = new OtherController3();

		var OtherController4 = otherController3.extend({
			newProperty: 'Value4',
			run: function() {
				return 'Run Controller 4';
			},
			newForthMethod: function() {
				return 'Return 4';
			}
		});
		var otherController4 = new OtherController4();

		otherController4.newProperty = 'Value5';
		
		expect(otherController3.run).toBeDefined();
		expect(otherController3.run()).toBe('Run Controller 3');
		expect(otherController3.oldProperty).toBe('Old value 1');
		expect(otherController3.newProperty).toBe('Value3');
		expect(otherController3.newMethod).not.toBeDefined();
		expect(otherController3.newSecondMethod).not.toBeDefined();
		expect(otherController3.newThirdMethod).toBeDefined();
		expect(otherController3.newThirdMethod()).toBe('Return 3');
		expect(otherController3.newForthMethod).not.toBeDefined();

		expect(otherController4.run).toBeDefined();
		expect(otherController4.run()).toBe('Run Controller 4');
		expect(otherController3.oldProperty).toBe('Old value 1');
		expect(otherController4.newProperty).toBe('Value5');
		expect(otherController4.newMethod).not.toBeDefined();
		expect(otherController4.newSecondMethod).not.toBeDefined();
		expect(otherController4.newThirdMethod).not.toBeDefined();
		expect(otherController4.newForthMethod).toBeDefined();
		expect(otherController4.newForthMethod()).toBe('Return 4');
		
		expect(controller.newProperty).not.toBeDefined();
		expect(controller.newMethod).not.toBeDefined()
		expect(controller.newSecondMethod).not.toBeDefined();
		expect(controller.newThirdMethod).not.toBeDefined();
		expect(controller.newForthMethod).not.toBeDefined();
		
		next();
	});
});