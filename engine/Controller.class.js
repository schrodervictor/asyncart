var Extendable = require('./Extendable.class');
var async = require('async');

var Controller = (new Extendable()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];
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

				// We have to use a clojure here to grant that the value of
				// key will be what we really expect. If removed, can lead to strange
				// results, such like rendering only one part of the page, multiple times
				// and skipping all other parts
				var task = (function(key){

					return function(callback) {

						var k = key;
						var route = partials[k].split('/');
						var group = route.shift();
						var controller = route.shift();
						controller = controller.charAt(0).toUpperCase() + controller.substr(1);
						var action = route.shift() || 'renderAsPartial';
						var PartialController = require(self.req.loadPoint + '/controller/' + group + '/' + controller + 'Controller.class');
						var partialController = new PartialController(self.req, self.res, self.next);
						partialController[action](function(err, html) {
							if(err) {
								callback(err);
							} else {
								self.res.locals[k] = html;
								//console.log('Rendered: ' + k + ' - result: ' + html);
								callback();
							}
						});
					
					};
				})(key);
			
			stack.push(task);
		};

		//console.log(stack);

		async.parallel(stack, function(err) {
			if(err) return origCallback(err);
			//console.log('Calling origCallback in RenderedPartials');
			origCallback();
		});
	},
	renderAsPartial: function(origCallback) {
		// each controller can override this method
		// to control the behavior when rendered as a partial

		// Method renderAsPartial needs to finish calling this line
		this.render(origCallback);
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
	forward: function(route) {
		var route = route.split('/');
		var group = route.shift();
		var controller = route.shift();
		controller = controller.charAt(0).toUpperCase() + controller.substr(1).toLowerCase();
		var action = (route.shift() || 'index') + 'Action';
		var Page = require(this.req.loadPoint + '/controller/' + group + '/' + controller + 'Controller.class');
		var page = new Page(this.req, this.res, this.next);
		if('function' === typeof(page[action])) {
			page[action]();
		} else {
			this.next();
		}
	},
	render: function(origCallback) {
		var self = this;
		if (!!self.childViews) self.data.partials = self.childViews;
		self.res.render(self.template, self.data, origCallback);
	},
	loaderOn: function() {
		if(!!this.load) return;
		var self = this;
		var load = self.req.load;
		self.load = {
			model: function(model) {
				return load.model(model, self);
			},
			controller: function(controller) {
				return load.controller(model, self);
			},
			engine: function(className) {
				return load.engine(className);
			}
		};
	}

	
});

module.exports = Controller;