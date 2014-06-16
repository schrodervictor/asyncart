var Controller = require('../../engine/Controller.class');
var View = require('../../engine/View.class');

var HomeController = (new Controller()).extend({
	
	index: function(req, res, next) {
		self = this;


		var view = new View(res, 'home');
		view.render({
			title: 'Homepage of NodeCart',
			content: 'Welcome to the main page',
			partials: {header: 'header'}
		});
	},
});

module.exports = HomeController;