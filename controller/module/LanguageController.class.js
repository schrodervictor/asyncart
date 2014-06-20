var Controller = require('../../engine/Controller.class');

var LanguageController = (new Controller()).extend({
	exposedActions: {
		init: false
	},
	init: function() {
		this.req = arguments[0];
		this.res = arguments[1];
		this.next = arguments[2];

		this.groupName = 'module';
		this.controllerName = 'language';
		this.route = 'module/language';
		this.template = 'module/language';
		this.data = {};
	}
});

module.exports = LanguageController;