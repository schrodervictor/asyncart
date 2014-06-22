var Model = require('../../engine/Model.class');
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
		var password = 'teste';
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
				var customer = {
					// id:
					firstname: 'Victor',
					lastname: 'Schröder',
					email: 'schrodervictor@gmail.com',
					telephone: '+00 000 0000 0000',
					salt: _salt,
					password: _pass,
					cart: {},
					wishlist: {},
					newsletter: true,
					addresses: [
						{  },
						{  }
					],
					groups: ['default'],
					ips: ['127.0.0.1'],
					additionalFields: {},
					status: 1,
					approved: true,
					dateAdded: new Date()
				};

		        callback(null, customer);
		    },
		    function(customer, callback) {

		    	self.collection.insert(customer, {w:1}, function(err, result){
		    		if(err) return callback(err);
		    		console.log(result);
		    		callback(null, result);
		    	});

		    }
		], function (err, result) {
			if(err) return origCallback(err);
			origCallback(null, result);
		});
			
	},
	update: function(data, callback) {
		this.collection().update({id: data.id}, data, {}, callback || function(){});
	},
	getList: function(callback, query) {
		this.collection().find(query || {}.toArray(callback));
	},
	remove: function(id, callback) {
		this.collection().findandModify({id: id}, [], {}, {remove:true}, callback);
	},
	getUser: function(id, callback) {
		this.collection().findOne({id: id}, callback);
	},
});

module.exports = CustomerModel;

