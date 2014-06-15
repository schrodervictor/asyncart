var AdminController = require('../controller/AdminController.class');

describe('AdminController class:', function() {
	it('should have all the controller methods', function(next) {
		var admin = new AdminController();

		// inherited method from Extendable
		expect(admin.extend).toBeDefined();
		expect(admin.isExtendable()).toBe(true);


		// inherited methods from Controller
		expect(admin.action).toBeDefined();
		expect(admin.run).toBeDefined();

		// new created methods
		expect(admin.login).toBeDefined();
		expect(admin.logout).toBeDefined();
		expect(admin.authorize).toBeDefined();
		expect(admin.getModel).toBeDefined();
		next();

	});

});
