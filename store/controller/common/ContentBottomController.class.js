var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var ContentBottomController = (new Controller()).extend({
	exposedActions: {

	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'contentBottom';
		this.route = 'common/content-bottom';
		this.template = 'common/contentBottom';
		this.data = {};
	},

});

module.exports = ContentBottomController;