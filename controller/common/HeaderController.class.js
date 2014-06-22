var Controller = require('../../engine/Controller.class');
var async = require('async');

var HeaderController = (new Controller()).extend({
	exposedActions: {
		init: false
	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'header';
		this.route = 'common/header';
		this.template = 'common/header';
		this.data = {};
	},
	
	renderAsPartial: function(origCallback) {
		var self = this;

		self.data = {
			title: 'Second title',
		};

		self.modelCustomer = new (require('../../model/account/CustomerModel.class'))(self.req, self.res);

		async.waterfall([

		    function(callback) {

				self.modelCustomer.addCustomer(null, function(err, result){
					if(err) return callback(err);
					self.res.locals.newId = result[0]._id;
		        	callback();
				});
		    
		    },
		    function(callback) {

				//self.modules = self.model.getModules();
				self.modules = {
					cart: 'module/cart',
					language: 'module/language',
					currency: 'module/currency',
				};

				self.renderedPartials(self.modules, function(err, result){
					callback();
				});
		    	
		    }
		], function(err) {
			if(err) return origCallback(err);
			self.render(origCallback);
		});

	},
});

module.exports = HeaderController;