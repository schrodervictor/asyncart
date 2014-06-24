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

			session.customer = customerData;
			session.customer.isLogged = true;

			session.save(function(err) {
				if(err) return callback(err);

				callback();
			});

		}


	},
	logout: function(callback) {
		var self = this;
		var session = this.req.session;

		callback = callback || function(){};

		// TODO Today if the customer doesn't logout and clean
		// the cookies, the session data will be lost (it will
		// be somewhere inside the DB, in sessions collections,
		// but not in the user profile)

		self.persistSession(function(err) {
			if(err) return callback(err);
			session.destroy();
			callback();
		});

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
	persistSession: function(callback) {

		if(!('session' in this.req) || !('customer' in this.req.session)) {
			return callback('No active session to persist');
		}

		var customer = this.req.session.customer;

		var dataToPersist = {};

		if(customer.cart) dataToPersist.cart = customer.cart;
		if(customer.wishlist) dataToPersist.wishlist = customer.wishlist;
//		if(customer.ips) dataToPersist = {'$addToSet': {ips : this.req.ip}};

		if(dataToPersist) {
			this.updateCustomer(dataToPersist, function(err, result) {
				if(err) return callback(err);
				callback();
			});
		} else {
			callback();
		}

	},
	isLogged: function() {
		var session = this.req.session;

		if(    !(session)
			|| !('customer' in session)
			|| !('isLogged' in session.customer)
			|| !(session.customer.isLogged)) {

			return false;
		}

		if(session.customer.isLogged) {
			return true;
		}

		return false;
	}
};


Customer.prototype.constructor = Customer;

module.exports = Customer;