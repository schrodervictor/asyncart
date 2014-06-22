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
	renderedPartials: function(partials, origCallback) {
		
		// Tip for the future. Once I forgot to right this little "var" in the
		// line bellow ("self = this", instead of "var self = this").
		// It was weird and leaded to a bug that was very hard to find, because
		// it changed the value of "self" in the caller function.
		// NEVER FORGET the "var" in your local variable declarations!!
		var self = this;
		var stack = [];

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
	renderAsPartial: function(origCallback) {
		// each controller can override this method
		// to control the behavior when rendered as a partial

		// Method renderAsPartial needs to finish calling this line
		this.render(origCallback);
	},
	requireController: function(route) {
		route = route.split('/');
		group = route.shift();
		controller = route.shift();
		controller = controller.charAt(0).toUpperCase() + controller.substr(1);
		return require('../controller/' + group + '/' + controller + 'Controller.class');
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
		var route = route.split('/');
		var group = route.shift();
		var controller = route.shift();
		controller = controller.charAt(0).toUpperCase() + controller.substr(1).toLowerCase();
		var action = route.shift() || 'index';
		var Page = require('../controller/' + group + '/' + controller + 'Controller.class');
		var page = new Page(req, res, next);
		if(page.isExposedAction(action)) {
			page[action](req, res, next);
		} else {
			next();
		}
	},
	render: function(origCallback) {
		var self = this;
		if (!!self.childViews) self.data.partials = self.childViews;
		self.res.render(self.template, self.data, origCallback);
	}
});

module.exports = Controller;