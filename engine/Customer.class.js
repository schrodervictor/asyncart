// Customer.class.js
var crypto = require('crypto');

function Customer(req) {
	this.req = req;
	this.customerModel = new (require('../model/account/CustomerModel.class'))(req, {});
};

Customer.prototype = {
	login: function(email, password, override, callback) {
		var self = this;
		var session = self.req.session;
		override = override || false;
		
		// Allow callback as the third parameter
		if ('function' === typeof override) {
			callback = override;
			override = false;
		}

		if(override) {
			self.loadCustomer(email, loadSession);
		} else {
			self.checkPassword(email, password, loadSession);
		}

		function loadSession(err, customerData) {

			if(err) return callback(err);

			if(!customerData) return callback('No data received');

			if('lastSession' in customerData) {

				console.log('There is a lastSession: ' + customerData.lastSession);

				console.log('Old req.sessionID: ' + self.req.sessionID);

				self.req.sessionID = customerData.lastSession;
				session.id = customerData.lastSession;

				console.log('New req.sessionID: ' + self.req.sessionID);

				session.reload(function(err) {
					if(err) return callback(err);

					session.customer = customerData;
					session.isLoggedCustomer = true;
					session.save();

					callback();
				});
			
			} else {
			
				console.log('There is no lastSession');

				session.customer = customerData;
				session.isLoggedCustomer = true;

				session.save(function(err) {
					if(err) return callback(err);

					self.persistSession(self.req.sessionID, function(err) {
						if(err) return callback(err);

						callback();
					});

				});

			}

		}


	},
	logout: function(callback) {
		var self = this;
		var session = this.req.session;

		callback = callback || function(){};

		self.persistSession(self.req.sessionID, function(err) {
			if(err) return callback(err);
			session.destroy();
			callback();
		});


//		this.req.sessionID = null;
//		session = null;
	},
	loadCustomer: function(email, callback) {

		this.customerModel.getCustomerByEmail(email, function(err, customerData) {
			if(err) return callback(err);
			if(!customerData) return callback('Customer not found!');
			callback(null, customerData);
		});
	
	},
	updateCustomer: function(dataToUpdate, callback) {

		if(    !('session' in this.req)
			|| !('customer' in this.req.session)
			|| !('_id' in this.req.session.customer)) {

			return callback('You need to login to perform this action!');

		}

		this.customerModel.update(this.req.session.customer._id, dataToUpdate, callback /*function(err, result){}*/);
	
	},
	checkPassword: function(email, password, callback) {

		this.loadCustomer(email, function(err, customerData) {
			if(err) return callback(err);

			if(!customerData) return callback('Customer not found!');

			crypto.pbkdf2(password, customerData.salt, 1000, 128, function(err, key) {
				if(err) return callback(err);

				if(key.toString('base64') === customerData.password) {
					callback(null, customerData);
				} else {
					callback('Password doesn\'t match!');
				}
        	});
		});
	
	},
	persistSession: function(sid, callback) {
		this.updateCustomer({lastSession: sid}, function(err, result) {
			if(err) return callback(err);
			callback();
		});
	},
};


Customer.prototype.constructor = Customer;

module.exports = Customer;