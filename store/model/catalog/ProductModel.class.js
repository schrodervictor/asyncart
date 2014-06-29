var config = require(__config)();
var Model = require(config.enginePath + '/Model.class');
var model = new Model();
var async = require('async');

var ProductModel = model.extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];

		// TODO This next line breaks the code if we try to load
		// this model inside the cart constructor
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

			console.log('Inside getProduct - productData:')
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

	},
	getInfoByCode: function(code, callback) {

		console.log('modelCatalogProduct: getInfoByCode(' + code + ')');

		var baseId = code.split('-')[0];

		console.log('Base ID: ' + baseId);

		this.getProduct(baseId, function(err, product) {
			if(err) return callback(err);

			// This method can return a empty set of products
			if(!product) return callback();

			// TODO perform this task in a non-blocking way
			var info = clone(product.base);

			if(!('options' in product)) return callback(null, info);

			var option = product.options.filter(function(elem) {
				return elem.id === code;
			});

			for(var key in option[0]) {
				info[key] = option[0][key];
			}

			console.log('inside getInfoByCode - info:');
			console.log(info);

			return callback(null, info);

		});

		/* Mockup */
		/*
		var product = {
			_id: 'nisndfauwefn',
			base: {
				id: '10',
				name: 'Sexy lingerie',
				canSellWithoutStock: false,
				price: 49.90
			},
			options: [
				{
					id: '10-color:blue-size:s',
					stock: 10,
					price: 59.90
				},
				{
					id: '10-color:blue-size:m',
					stock: 3
				}
			]
		};
		*/


	}
});


function clone(something) {
	if(null === something)
		return null;
	if('undefined' === typeof something)
		return undefined;
	if('function' === typeof something)
		return something;
	if(Array.isArray(something)) {
		var newArray = something.slice();
		return newArray.map(function(elem) {
			if('object' === typeof elem || Array.isArray(elem))
				return clone(elem);
			else
				return elem;
		});
	}
	if('object' === typeof something) {
		var newObj = {};
		var keys = Object.keys(something);
		for (var i = 0, j = keys.length; i < j; i++) {
			newObj[keys[i]] = clone(something[keys[i]]);
		};
		return newObj;
	}
	return something;
}

module.exports = ProductModel;

