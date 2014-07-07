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
	indexAction: function() {
		var self = this;
		
		async.series([
			function(callback) {

				var formStructure = {
					action: 'product/add',
					method: 'POST',
					fields: [
						{
							value: '',
							name: 'base[id]',
							isHidden: true,
						},
						{
							label: 'Product name',
							value: '',
							name: 'base[name]',
							isText: true,
						},
						{
							label: 'Price',
							value: '',
							name: 'base[price]',
							isText: true,
						},
						{
							label: 'Description',
							value: '',
							name: 'base[description]',
							isTextarea: true,
						},
						{
							label: 'Category',
							value: '',
							name: 'base[category]',
							isSelect: true,
							options: [
								{label: 'lingerie', value: 'lingerie'},
								{label: 'sexy', value: 'sexy', selected: true}
							]
						}
					],
					options: {
						pattern: {},
						active: []
					}
				};

				//formStructure.options.pattern = self.getOptionsPattern();
				//formStructure.options.active = self.getActiveOptions();

				self.data.form = formStructure;
				callback();

			},
			function(callback) {
			
/*			    self.load.model('catalog/product');

			    var productId = self.req.query.productId || 'none';

			    if(self.req.query.product) {

			        self.modelCatalogProduct.getProduct(productId, function(err, productData) {

			        	if(err) return callback(err);

			        	if(!productData) return callback('Product not found');

			        	self.data.editProduct = productData;
			        	return callback();
			        });
			    } else {
*/
			    	self.data.newProduct = 'Add new product';
			    	return callback();
//			    }
			
			},
			function(callback) {

				self.buildBreadcrumbs(function(err) {
					if(err) return callback(err);
					return callback();
				});

			},
			function(callback) {
/*
				var partials = {
					contentTop: 'common/contentTop',
					contentBottom: 'common/contentBottom',
					header: 'common/header',
					footer: 'common/footer'
				}

				self.renderedPartials(partials, function(err) {
					if(err) return callback(err);
*/					callback();
/*				});
*/			}
		], function(err) {

			if(err) return self.next(err);

			return self.render();

		});

	},
	addAction: function() {
		this.template = 'catalog/product-add';

		this.data.product = JSON.stringify(this.req.body);

		this.render();


	},
	buildBreadcrumbs: function(callback) {

		var self = this;
		var categories = self.req.categories;
		self.data.breadcrumbs = [];

		self.data.breadcrumbs.push({
			text: 'Admin Home',
			href: '/admin/home',
			separator: null
		});

		self.data.breadcrumbs.push({
			text: 'Product list',
			href: '/admin/product-list',
			separator: '>'
		});

		// TODO personalize this last link to a specific product
		self.data.breadcrumbs.push({
			text: 'Product',
			href: '/admin/product',
			separator: '>'
		});

		return callback();

	}
});

module.exports = ProductController;