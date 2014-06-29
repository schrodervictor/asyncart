var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var FooterController = (new Controller()).extend({
	exposedActions: {

	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'footer';
		this.route = 'common/footer';
		this.template = 'common/footer';
		this.data = {};
	},
	renderAsPartial: function(callback) {
		this.data = {
			copyright: '2014 NodeCart. All Rights Reserved.'
		}
		this.render(callback);
	}

});

module.exports = FooterController;