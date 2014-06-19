var Controller = require('../../engine/Controller.class');

var HeaderController = (new Controller()).extend({
	exposedActions: {
		init: false,
		index: false
	},
	init: function() {
		this.groupName = 'common';
		this.controllerName = 'header';
		this.route = 'common/header';
		this.data = {};
	},
	
	index: function(req, res, next) {
		self = this;

		this.data = {

		};

		this.renderPartials(req, res, next, [
			'cart',
			'language',
			'currency',
		]);

		console.log('called render');

		this.render(res);
	},
});

module.exports = HeaderController;