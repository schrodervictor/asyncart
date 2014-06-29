var Controller = require('../../engine/Controller.class');

var CurrencyController = (new Controller()).extend({
	exposedActions: {
		init: false
	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'module';
		this.controllerName = 'currency';
		this.route = 'module/currency';
		this.template = 'module/currency';
		this.data = {};
	}
});

module.exports = CurrencyController;