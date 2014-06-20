var Controller = require('../../engine/Controller.class');

var HeaderController = (new Controller()).extend({
	exposedActions: {
		init: false
	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'header';
		this.route = 'common/header';
		this.template = 'common/header';
		this.data = {};
	},
	
	renderAsPartial: function(callback) {
		self = this;

		this.data = {
			title: 'Second title',
		};

		this.renderedPartials({
			cart: 'module/cart',
			language: 'module/language',
			currency: 'module/currency',
		});

		this.render(callback);
	},
});

module.exports = HeaderController;