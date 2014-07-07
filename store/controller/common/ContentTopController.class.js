var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var ContentTopController = (new Controller()).extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'contentTop';
		this.route = 'common/content-top';
		this.template = 'common/contentTop';
		this.data = {};
	},

});

module.exports = ContentTopController;