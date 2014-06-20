var Extendable = require('./Extendable.class');

var Controller = (new Extendable()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];
	},
	exposedActions: {
		index: true
	},
	index: function() {

	},
	simplePartials: function(childViews) {
		this.childViews = childViews;
	},
	/**
	 * Method renderedPartials(req, res, next, partials)
	 * This method is destinated to render partials views
	 * completelly. They will really render BEFORE the final
	 * rendering. That means these partials will be available
	 * as local variables, in html format. They have to be
	 * placed inside the view with triple mustache.
	 * For example, this call in a controller method:
	 *
	 * this.renderedPartials({
	 *     header: 'header',
	 *     footer: 'footer'	
	 * });
	 *
	 * will be populated as:
	 *
	 *     res.locals.header
	 *     res.locals.footer
	 *
	 * And have to be rendered as:
	 *
	 *     {{{ header }}}
	 *     {{{ footer }}}
	 */
	renderedPartials: function(partials) {
		self = this;
		var group, controller, action;
		//for (var i = 0, j = partials.length; i < j; i++) {
		for(var key in partials) {
			if(!partials.hasOwnProperty(key)) continue;

			route = partials[key].split('/');
			group = route.shift();
			controller = route.shift();
			controller = controller.charAt(0).toUpperCase() + controller.substr(1);
			action = route.shift() || 'renderAsPartial';
			var PartialController = require('../controller/' + group + '/' + controller + 'Controller.class');
			partialController = new PartialController(self.req, self.res, self.next);
			partialController[action](function(err, html) {
				if(err) {
					self.next(err)
				} else {
					self.res.locals[key] = html;
				}
			});
		};
	},
	/**
	 * This method delegates the answer for a request
	 * to other controller, without a redirect.
	 * To redirect to homepage, for example, this
	 * should be called as followed:
	 *
	 * this.forward(req, res, next, 'common/home');
	 * or
	 * this.forward(req, res, next, 'common/home/index');
	 *
	 */
	forward: function(req, res, next, route) {
		route = route.split('/');
		group = route.shift();
		controller = route.shift();
		controller = controller.charAt(0).toUpperCase() + controller.substr(1).toLowerCase();
		action = route.shift() || 'index';
		var Page = require('../controller/' + group + '/' + controller + 'Controller.class');
		(new Page())[req.action || 'index'](req, res, next);
	},
	render: function(res) {
		var View = require('../engine/View.class');
		var view = new View(res, this.controllerName);
		view.render(this.data);
	}

});

module.exports = Controller;