var Model = require('../../engine/Model.class');
var model = new Model();
var async = require('async');

var ProductModel = model.extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.collection = this.req.db.collection('product');
	},
	getProduct: function(id, callback) {
		var self = this;
		var session = self.req.session;
		var id = id || null;
		
		// Allow callback as the third parameter
		if ('function' === typeof id) {
			var callback = id;
			id = self.req.params.product;
			console.log('Product id: ' + id);
		}

		if(!id) return callback('Product id not set');

		self.collection.findOne({id: id}, function(err, productData) {
			if(err) return callback(err);

			console.log(productData);
			if(!productData) return callback('Product not found');


			callback(null, productData);

		});
			
	},
	getProductsByCategory: function(category, callback) {
		var self = this;
		var session = self.req.session;
		var category = category || null;
		
		// Allow callback as the first parameter
		if ('function' === typeof category) {
			var callback = category;
			var length = self.req.categories.length;
			category = self.req.categories[length - 1];
		}

		if(!category) return callback('Category id not set');

		this.collection.find({category: category}, function(err, productsCursor) {
			if(err) return callback(err);

			productsCursor.toArray(function(err, productsArray) {
				if(err) return callback(err);

				// This method can return a empty set of products
				callback(null, productsArray);

			});

		});

	}

});

module.exports = ProductModel;

