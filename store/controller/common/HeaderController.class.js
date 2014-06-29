var Controller = require('../../engine/Controller.class');
var async = require('async');

var HeaderController = (new Controller()).extend({
    exposedActions: {
        init: false,
    },
    init: function() {
        this.req = arguments[0];
        this.res = arguments[1];
        this.next = arguments[2];

        this.groupName = 'common';
        this.controllerName = 'header';
        this.route = 'common/header';
        this.template = 'common/header';
        this.loaderOn();
        this.data = {};
    },
    renderAsPartial: function(origCallback) {
        var self = this;
        var session = self.req.session;

        self.data = {
            title: 'Second title',
        };

        var customer = self.load.engine('customer');

        if(customer.isLogged()) {
            self.data.customerName = session.customer.firstname + ' ' + session.customer.lastname;
            self.data.customerId = session.customer._id;
        }

        //self.modules = self.model.getModules();
        self.modules = {
            cart: 'module/cart',
            language: 'module/language',
            currency: 'module/currency',
        };

        self.renderedPartials(self.modules, function(err, result){

            self.render(origCallback);
        
        });
    },
});

module.exports = HeaderController;