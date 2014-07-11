var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');
var async = require('async');

var CustomerController = (new Controller()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];

		this.groupName = 'account';
		this.controllerName = 'customer';
		this.route = 'account/customer';
		this.template = 'account/customer';
		this.loaderOn();
		this.data = {};
	},
	
	indexAction: function() {

		var self = this;

		//self.loadModel('account/customer');

		var customer = self.req.customer;

		console.log(self.req);

		if(!customer.isLogged()) {
			self.res.redirect('customer/login');
			return;
		}

		if(customer.isLogged()) {
			// show customer control panel

		}
	},
	loginAction: function() {
		var self = this;

		var customer = self.req.customer;

		async.series([
			function(callback) {

				self.data.error = {
					login: {},
					register: {}
				};
				// It's a login attempt?
				if('POST' === self.req.method) {
					if(!self.req.body.username) {
						self.data.error.login.username = 'Username is required';
					}
					if(!self.req.body.password) {
						self.data.error.login.password = 'Password is required';
					}
					if(self.req.body.username && self.req.body.password) {
						customer.login(self.req.body.username, self.req.body.password, function(err, customerData) {
							if(err) {
								console.log(err);
								self.data.error.login.message = err;
							} else {
								self.data.login = {
									result: 'success',
									customer: {
										firstname: customerData.firstname,
										lastname: customerData.lastname,
									}
								}
							}

							callback();

						});
					}
				}
				callback();
			},
			function(callback) {

				// It's an ajax login?
				if(self.req.xhr) {
					self.res.json(self.req.data);
				}

				// It's not an ajax request. Was the login successful?
				if('login' in self.data && 'success' === self.data.login.result) {
					self.res.redirect('customer/index');
				}

				callback();

			},
			function(callback) {

				// If we are here, we have to show the login page

				self.data.loginForm = {
					// TODO use the url generator here to not leave the action field empty
					action: '',
					method: 'POST',
					fields: [
						{
							label: 'Username: ',
							value: self.req.body.username,
							name: 'username',
							isText: true,
						},
						{
							label: 'Password: ',
							value: '',
							name: 'password',
							isPassword: true,
						},
					],
				};

				callback();



			}
		], function(err) {
			if(err) return self.next(err);

			self.template = 'account/customer-login';
			self.render();


		});




	}

});

module.exports = CustomerController;