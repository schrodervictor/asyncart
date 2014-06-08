var Extendable = require('../engine/Extendable.class');
describe('Extendable base class', function() {
	it('should create new instances', function(next) {
		var extendable = new Extendable();
		expect(extendable).toBeDefined();
		next();
	});
	it('should implement method "extend"', function(next) {
		var extendable = new Extendable();
		expect(extendable.extend).toBeDefined();
		next();
	});
	it('the childs should be extendable also', function(next) {
		var extendable = new Extendable();
		
		var SubExtendable = extendable.extend({});
		var subExtendable = new SubExtendable();
		
		var SubSubExtendable = subExtendable.extend({});
		var subSubExtendable = new SubSubExtendable();

		expect(subExtendable.extend).toBeDefined();
		expect(subSubExtendable.extend).toBeDefined();
		next();
	});
	it('should not mess the prototype chain for properties', function(next) {
		var extendable = new Extendable();
		
		var SubExtendable = extendable.extend({
			newProperty1: 'Value 1',
		});
		var subExtendable = new SubExtendable();
		
		var SubSubExtendable = subExtendable.extend({
			newProperty1: 'Value 1.1',
			newProperty2: 'Value 2'
		});
		var subSubExtendable = new SubSubExtendable();

		expect(extendable.newProperty1).not.toBeDefined();
		expect(extendable.newProperty2).not.toBeDefined();

		expect(subExtendable.newProperty1).toBe('Value 1');
		expect(subExtendable.newProperty2).not.toBeDefined();

		expect(subSubExtendable.newProperty1).toBe('Value 1.1');
		expect(subSubExtendable.newProperty2).toBe('Value 2');
		next();
	});
	it('the SubSub child should have the not overrrided parent\'s properties', function(next) {
		var extendable = new Extendable();
		
		var SubExtendable = extendable.extend({
			newProperty1: 'Value 1',
			myMethod1: function() {
				return 'Method 1 return';
			}
		});
		var subExtendable = new SubExtendable();
		
		var SubSubExtendable = subExtendable.extend({
			newProperty2: 'Value 2',
			myMethod2: function() {}
		});
		var subSubExtendable = new SubSubExtendable();

		expect(extendable.isExtendable).toBeDefined();
		expect(extendable.newProperty1).not.toBeDefined();
		expect(extendable.newProperty2).not.toBeDefined();
		expect(extendable.myMethod1).not.toBeDefined();
		expect(extendable.myMethod2).not.toBeDefined();

		expect(subExtendable.isExtendable).toBeDefined();
		expect(subExtendable.newProperty1).toBe('Value 1');
		expect(subExtendable.newProperty2).not.toBeDefined();
		expect(subExtendable.myMethod1).toBeDefined();
		expect(subExtendable.myMethod2).not.toBeDefined();

		expect(subSubExtendable.isExtendable).toBeDefined();
		expect(subSubExtendable.newProperty1).toBe('Value 1');
		expect(subSubExtendable.newProperty2).toBe('Value 2');
		expect(subSubExtendable.myMethod1()).toBe('Method 1 return');
		expect(subSubExtendable.myMethod2).toBeDefined();
		next();
	});
});