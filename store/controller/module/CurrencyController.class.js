var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var CurrencyController = (new Controller()).extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'module';
		this.controllerName = 'currency';
		this.route = 'module/currency';
		this.template = 'module/currency';
		this.data = {};
	}
});

module.exports = CurrencyController;