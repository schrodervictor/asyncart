var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var ColumnRightController = (new Controller()).extend({
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'common';
		this.controllerName = 'columnRight';
		this.route = 'common/column-right';
		this.template = 'common/columnRight';
		this.data = {};
	},

});

module.exports = ColumnRightController;