var Controller = require('../../engine/Controller.class');
var async = require('async');

var CategoryController = (new Controller()).extend({
	init: function(req, res, next) {
		this.req = req || arguments[0];
		this.res = res || arguments[1];
		this.next = next || arguments[2];

		this.groupName = 'catalog';
		this.controllerName = 'category';
		this.route = 'catalog/category';
		this.template = 'catalog/category';
		this.loaderOn();
		this.data = {};
	},
	
	index: function() {
		var self = this;

   		this.load.model('catalog/category');
   		this.load.model('catalog/product');

		async.series([
			function(callback) {

				self.modelCatalogCategory.getCategory(function(err, categoryData) {
					if(err) return callback(err);

					if(!categoryData) return callback('Category not found');

		        	self.data.title = 'Category: ' + categoryData.name;
		        	self.data.category = categoryData;
		        	callback();

				});

			},
			function(callback) {

		        self.modelCatalogProduct.getProductsByCategory(function(err, productsArray) {

		        	if(err) return callback(err);

		        	// The Category can be empty!!
		        	// if(!productsArray) return callback('Product not found');

		        	self.data.products = productsArray;
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

	    //self.modelCatalogCategory = new (require('../../model/catalog/CategoryModel.class'))(self.req, self.res);

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

			origCallback();
		});

	}
});

module.exports = CategoryController;