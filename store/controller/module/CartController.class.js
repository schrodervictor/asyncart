var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var CartController = (new Controller()).extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'module';
		this.controllerName = 'cart';
		this.route = 'module/cart';
		this.template = 'module/cart';
		this.data = {};
	},
	renderAsPartial: function(origCallback) {
		var self = this;
		var session = self.req.session;

		var productId = '20';
		var options = {color: 'blue', size: 's'};
		var quantity = 5;

		self.req.cart.add(productId, options, quantity, function(){
			self.data = {
				cartObject: JSON.stringify(session.cart),
				cart: session.cart,
			}

			self.render(origCallback);
		});
	
	}


});

module.exports = CartController;