var Extendable = require('./Extendable.class');

var Controller = (new Extendable()).extend({
	index: function() {

	},
	action: function(params) {
		
	},
	renderPartials: function(req, res, next, partials) {
		var View = require('../engine/View.class');
		for (var key in partials) {
			var view = new View(res, partials[key]);
			view.render(null, function(err, html) {
				if(err) next(err);
				else res.locals[key] = html;
			});
		};
	},
	forward: function(req, res, next, route) {
		route = route.split('/');
		group = route.shift();
		controller = route.shift();
		controller = controller.charAt(0).toUpperCase() + controller.substr(1).toLowerCase();
		action = route.shift() || 'index';
		var Page = require('../controller/' + group + '/' + controller + 'Controller.class');
		(new Page())[req.action || 'index'](req, res, next);
	}

});

module.exports = Controller;