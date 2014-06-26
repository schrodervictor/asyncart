// Cart.class.js
var async = require('async');

function Cart(req) {
	this.req = req;

	// TODO Loader class is not working in this constructor
	// this.load.model('catalog/product');

	if(!req.session.cart) {
		req.session.cart = createEmptyCart();
	}

	function createEmptyCart() {
		return {
			products: [],
			totals: [],
			total: 0,
			shipping: {},
			alert: []
		};
	};
};

Cart.prototype = {
	add: function(productId, options, quantity, callback) {

		// This allows to call
		// .add(product, quantity [,callback])
		if('number' === typeof options) {
			callback = quantity || function(){};
			quantity = options;
			options = null;
		}

		// This allows to call
		// .add(productId, callback)
		//
		// with quantity = 1
		if('function' === typeof options) {
			callback = options;
			quantity = 1;
			options = null;
		}

		// This allows to call
		// .add(productId, options [,callback])
		//
		// with quantity = 1
		if('object' === typeof options && 'number' !== typeof quantity) {
			callback = quantity || function(){};
			quantity = 1;
		}

		// And this allows to call
		// .add(productId)
		//
		// with quantity = 1
		if(!options && !quantity && !callback) {
			callback = function(){};
			quantity = 1;
			options = null;
		}

		var self = this;

		self.load.model('catalog/product');

		self.modelCatalogProduct.getProduct(productId, function(err, productData) {
			if(err) return callback(err);

			if(!productData) return callback('Product not found');

			return self.addWithProductObject(productData, options, quantity, callback);

		});

	},
	addWithProductObject: function(product, options, quantity, origCallback) {

		var self = this;
		var cart = self.req.session.cart;

		var key = product.base.id;

		if(options) {
			var opKeys = Object.keys(options).sort();
			for (var i = 0, j = opKeys.length; i < j; i++) {
				key += '-' + opKeys[i] + ':' + options[opKeys[i]];
			}
		}

		async.detectSeries(cart.products, function(item, callback) {
			if(item.id === key) return callback(true);
			else return callback(false);
		}, function(item) {

			if(item) {

				item.quantity += quantity;
				//self.alert.push('Quantity updated');

				// TODO Maybe we don't need to update the cart in every
				// product adition
				return self.update(origCallback);
			
			}

			cart.products.push({
				id: key,
				quantity: quantity,
				options: options
			});
			//self.alert.push('Product ' + product.name + ' added');

			// TODO Maybe we don't need to update the cart in every
			// product adition
			return self.update(origCallback);

		});

	},
	update: function(origCallback) {
		var self = this;
		if(!self.modelCatalogProduct) self.load.model('catalog/product');
		var cart = this.req.session.cart;
		var products = cart.products;
		var total = 0;

		// TODO This method deserves an optimization because
		// it does a lot of database requests

		async.map(products, function(product, callback) {

			console.log('inside update, async.each - product.id: ' + product.id);

			if(    product.quantity <= 0
				|| !product.quantity) {
				return callback(null, null);
			}

			self.modelCatalogProduct.getInfoByCode(product.id, function(err, info) {
				if(err) return callback(err);

				if(!info) {
					cart.alert.push('Product: ' + product.name + ' not found');
					return callback(null, null);
				}

				if(info.canSellWithoutStock === true) {
					product.info = info;
					product.price = info.price;
					total += info.price * product.quantity;
					return callback(null, product);
				}
				
				if(info.stock === 0 || info.stock === null || info.stock === undefined) {
					cart.alert.push('Product: ' + info.name + ' out of stock');
					return callback(null, null);
				}

				if(info.stock < product.quantity) {
					product.quantity = info.stock;
					cart.alert.push('Product: ' + info.name + ' with limited stock');
				}

				product.info = info;
				product.price = info.price;
				total += info.price * product.quantity;
				return callback(null, product);
			});
		},
		function(err, newProducts){
			if(err) return origCallback(err);

			cart.products = newProducts.filter(function(elem) {
				return !!elem;
			});

			cart.total = total;

			return self.updateTotals(origCallback);

		});

	},
	remove: function(productId, options, quantity, callback) {

		// This allows to call
		// .remove(product, quantity [,callback])
		if('number' === typeof options
		   || 'all' === options) {
			callback = quantity || function(){};
			quantity = options;
			options = null;
		}

		// This allows to call
		// .remove(productId, callback)
		//
		// with quantity = 'all'
		if('function' === typeof options) {
			callback = options;
			quantity = 'all';
			options = null;
		}

		// This allows to call
		// .remove(productId, options [,callback])
		//
		// with quantity = 'all'
		if('object' === typeof options
			&& ('number' !== typeof quantity
				|| 'all' === quantity)) {
			callback = quantity || function(){};
			quantity = 'all';
		}

		// And this allows to call
		// .remove(productId)
		//
		// with quantity = 'all'
		if(!options && !quantity && !callback) {
			callback = function(){};
			quantity = 'all';
			options = null;
		}

		var self = this;
		var session = self.req.session;

		if(quantity === 'all') {
			
			var key = productId;

			if(options) {
				var opKeys = Object.keys(options).sort();
				for (var i = 0, j = opKeys.length; i < j; i++) {
					key += '-' + opKeys[i] + ':' + options[opKeys[i]];
				}
			}

			session.cart.products = session.cart.products.filter(function(elem) {
				return elem.id !== key;
			});

			return self.update(callback);

		} else {

			quantity = quantity > 0 ? -quantity : quantity;

			return self.add(productId, options, quantity, callback);
		}

	},
	updateTotals: function(callback) {

		// TODO update the total with the "totals"

		return callback();
	},
	get load() {
		var self = this;
		var load = this.req.load;
		return {
			model: function(model) {
				return load.model(model, self);
			},
			engine: function(engine) {
				return load.engine(engine, self);
			}
		}
	}

};


Cart.prototype.constructor = Cart;

module.exports = function(req, res, next) {
	req.cart = new Cart(req);
	console.log('Cart instance attached in req.cart');
	next();
}