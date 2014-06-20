var Controller = require('../../engine/Controller.class');

var CartController = (new Controller()).extend({
	exposedActions: {
		init: false
	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'module';
		this.controllerName = 'cart';
		this.route = 'module/cart';
		this.template = 'module/cart';
		this.data = {};
	}
});

module.exports = CartController;