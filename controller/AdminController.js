var Controller = require('../engine/Controller.class');
var View = require('../engine/View.class');

var AdminController = (new Controller()).extend({
	name: 'Admin',
	run: function(req, res, next) {
		if(this.authorize(req)) {
			req.session.fastdelivery = true;
			req.session.save();
			var view = new View(res, 'admin');
			view.render({
				title: 'Administration',
				content: 'Welcome to the control panel'
			});
			
		} else {
			var view = new View(res, 'admin-login');
			view.render({
				title: 'Please login',
			});
		}
	},
	authorize: function(req) {
		var isAuthenticated =
			req.session &&
			req.session.fastdelivery &&
			req.session.fastdelivery === true;

		var isAutenticating =
			req.body &&
			req.body.username === 'victor' &&
			req.body.password === 'pass';

		return isAuthenticated || isAutenticating;
	},
	logout: function(req, res, next) {
		req.session.destroy(function(err) {
			if (err) next(err);
			res.redirect('/');
		});
	}
});

module.exports = AdminController;