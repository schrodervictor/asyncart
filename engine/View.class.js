var Extendable = require('./Extendable.class');

var View = (new Extendable()).extend({
	init: function(res, template) {
		this.res = res;
		this.template = template;
	},
	render: function(data) {
		if(this.res && this.template) {
			this.res.render(this.template, data);
		}
	}
});

module.exports = View;