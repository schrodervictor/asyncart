var Model = require('../engine/Model.class');
var dbMockup = {db: {}};

describe('Model class', function() {
	it('should create a new model', function(next) {
		var model = new Model(dbMockup);
		expect(model.db).toBeDefined();
		expect(model.extend).toBeDefined();
		expect(model.collection).toBeDefined();
		expect(model.setDB).toBeDefined();
		next();
	});
	it('should be extensible', function(next) {
		var model = new Model(dbMockup);
		var OtherTypeOfModel = model.extend({
			newProperty: 'Value 1',
			myCustomModelMethod: function() {}
		});
		var model2 = new OtherTypeOfModel(dbMockup);
		expect(model2.db).toBeDefined();
		expect(model2.extend).toBeDefined();
		expect(model2.collection).toBeDefined();
		expect(model2.setDB).toBeDefined();
		expect(model2.myCustomModelMethod).toBeDefined();
		expect(model.newProperty).not.toBeDefined();
		next();
	});
});