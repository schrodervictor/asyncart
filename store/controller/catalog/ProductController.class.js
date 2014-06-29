var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');
var async = require('async');

var ProductController = (new Controller()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];

		this.groupName = 'catalog';
		this.controllerName = 'product';
		this.route = 'catalog/product';
		this.template = 'catalog/product';
		this.loaderOn();
		this.data = {};
	},
	
	index: function() {
		var self = this;

		async.series([

			function(callback) {
			
			    self.load.model('catalog/product');

		        self.modelCatalogProduct.getProduct(function(err, productData) {


		        	if(err) return callback(err);
		        	if(!productData) return callback('Product not found');

		        	self.data.title = 'Product: ' + productData.name;
		        	self.data.product = productData;
		        	callback();
		        });
			
			},
			function(callback) {

				self.buildBreadcrumbs(function(err) {
					if(err) return callback(err);
					callback();
				});

			},
			function(callback) {

				var partials = {
					columnLeft: 'common/columnLeft',
					columnRight: 'common/columnRight',
					contentTop: 'common/contentTop',
					contentBottom: 'common/contentBottom',
					header: 'common/header',
					footer: 'common/footer'
				}

				self.renderedPartials(partials, function(err) {
					if(err) return callback(err);
					callback();
				});
			}
		], function(err) {

			if(err) return self.next(err);

			self.render();

		});

	},
	buildBreadcrumbs: function(origCallback) {

		var self = this;
		var categories = self.req.categories;
		self.data.breadcrumbs = [];

		self.data.breadcrumbs.push({
			text: 'Home',
			href: '/common/home',
			separator: null
		});

		self.data.breadcrumbs.push({
			text: 'Catalog',
			href: '/catalog/main',
			separator: '>'
		});

	    self.load.model('catalog/category');
	    
	    var categoryChain = '';

		async.eachSeries(categories, function(categoryId, callback) {

			self.modelCatalogCategory.getCategoryById(categoryId, function(err, categoryData) {

				self.data.breadcrumbs.push({
					text: categoryData.name,
					href: '/category/' + categoryChain + categoryId,
					separator: '>'
				});

				categoryChain = categoryChain + categoryId + '-';

				callback();

			});

		}, function(err) {
			if(err) return origCallback(err);

			self.data.breadcrumbs.push({
				text: self.data.product.name,
				href: '/category/' + categoryChain + '/product/' + self.data.product.id,
				separator: '>'
			});

			origCallback();
		});

	}
});

module.exports = ProductController;