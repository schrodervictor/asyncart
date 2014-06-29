var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');
var model = new Model();
var crypto = require('crypto');
var async = require('async');

var CustomerModel = model.extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.collection = this.req.db.collection('customer');
	},
	addCustomer: function(data, origCallback) {
		var self = this;
		var _salt, _pass;
		var password = data.password;
		var iterations = 1000;
		var keylen = 128;

		async.waterfall([
		    function(callback) {

				crypto.randomBytes(128, function(err, buf) {
					if(err) return callback(err);
					_salt = buf.toString('base64');
		        	callback();
				});

		    },
		    function(callback) {

				crypto.pbkdf2(password, _salt, iterations, keylen, function(err, key) {
					if(err) return callback(err);
					_pass = key.toString('base64');
			        callback();
	        	});

		    },
		    function(callback) {

				// TODO data validation
				var customer = data;
					customer.password = _pass;
					customer.salt = _salt;
					customer.status = 1;
					customer.approved = true;
					customer.dateAdded = new Date();

		    	self.collection.insert(customer, {w:1}, function(err, result){
		    		if(err) return callback(err);
		    		callback(null, result);
		    	});

		    }
		], function (err, result) {
			if(err) return origCallback(err);
			origCallback(null, result);
		});
			
	},
	getCustomerByEmail: function(email, callback) {

		this.collection.findOne({email: email}, function(err, userData) {
			if(err) return callback(err);
			callback(null, userData);
		});

	},
	update: function(_id, data, callback) {
		this.collection.update({_id: _id}, {'$set': data}, {w: 1}, function(err, result){
			if(err) return callback(err);
			callback();
		});
	},

});

module.exports = CustomerModel;

