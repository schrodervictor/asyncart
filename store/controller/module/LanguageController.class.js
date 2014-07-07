var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');

var LanguageController = (new Controller()).extend({
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