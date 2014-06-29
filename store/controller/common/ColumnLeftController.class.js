var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var ColumnLeftController = (new Controller()).extend({
	exposedActions: {

	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'columnLeft';
		this.route = 'common/column-left';
		this.template = 'common/columnLeft';
		this.data = {};
	},

});

module.exports = ColumnLeftController;