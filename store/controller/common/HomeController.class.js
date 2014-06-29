var Controller = require('../../engine/Controller.class');

var HomeController = (new Controller()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];

		this.groupName = 'common';
		this.controllerName = 'home';
		this.route = 'common/home';
		this.template = 'common/home';
		this.data = {};
	},
	
	index: function() {
		var self = this;

		this.data = {
			title: 'Homepage of NodeCart',
			content: 'Welcome to the main page',
		};
		this.res.locals.title = 'Homepage of NodeCart';

		this.renderedPartials({
			columnLeft: 'common/columnLeft',
			columnRight: 'common/columnRight',
			contentTop: 'common/contentTop',
			contentBottom: 'common/contentBottom',
			header: 'common/header',
			footer: 'common/footer'
		}, function(err) {

			//console.log(self.res.locals);

			self.render();
			
		});
/*
		this.simplePartials({
			header: 'header'
		});
*/

	},
});

module.exports = HomeController;