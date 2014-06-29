var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');
var View = require(config.enginePath + '/View.class');
var AdminModel = require('../../model/admin/AdminModel.class');

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
			res.redirect('/admin/login');
		}
	},
	login: function(req, res, next) {
		if(this.authorize(req)) {
			req.session.fastdelivery = true;
			req.session.save();
			res.redirect('/admin');
		} else {
			var view = new View(res, 'admin-login');
			view.render({
				title: 'Please login',
			});
		}
	},
	logout: function(req, res, next) {
		req.session.destroy(function(err) {
			if (err) next(err);
			res.redirect('/');
		});
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
	getModel: function(req) {
		this.model = this.model || new AdminModel(req.db);
		return this.model;
	}
});

module.exports = AdminController;