var Extendable = require('./Extendable.class');

var View = (new Extendable()).extend({
	init: function(res, template) {
		this.res = res;
		this.template = template;
	},
	partials: function(childViews) {
		this.childViews = childViews;
	},
	render: function(data) {
		if(this.res && this.template) {
			if (!!this.childViews) data.partials = this.childViews;
			this.res.render(this.template, data);
		}
	}
});

module.exports = View;