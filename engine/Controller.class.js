var Extendable = require('./Extendable.class');

var Controller = (new Extendable()).extend({
	index: function() {

	},
	action: function(params) {
		
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