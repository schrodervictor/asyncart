var Controller = require('../../engine/Controller.class');

var HomeController = (new Controller()).extend({
	init: function() {
		this.groupName = 'common';
		this.controllerName = 'home';
		this.route = 'common/home';
		this.data = {};
	},
	
	index: function(req, res, next) {
		self = this;

		this.data = {
			title: 'Homepage of NodeCart',
			content: 'Welcome to the main page',
		};

		this.renderPartials(req, res, next, [
			'columnLeft',
			'columnRight',
			'contentTop',
			'contentBottom',
			'header',
			'footer'
		]);
		/*
		view.partials({
			header: 'header',
//			contentTop: 'contentTop',
//			contentBottom: 'contentBottom',
			footer: 'footer'
		});
*/
		console.log('called render');

		this.render(res);
	},
});

module.exports = HomeController;