var Controller = require('../../engine/Controller.class');
var async = require('async');

var HeaderController = (new Controller()).extend({
    exposedActions: {
        init: false,
        customer: true,
        logout: true
    },
    init: function() {
        this.req = arguments[0];
        this.res = arguments[1];
        this.next = arguments[2];

        this.groupName = 'common';
        this.controllerName = 'header';
        this.route = 'common/header';
        this.template = 'common/header';
        this.data = {};
    },
    customer: function() {
        console.log('Inside method customer in HeaderController');
        var self = this;
        var session = this.req.session;
        self.template = 'common/customer-test';

        var Customer = require('../../engine/Customer.class');

        var customer = new Customer(self.req);
        console.log('New Customer instance created');

        customer.login('schrodervictor@gmail.com', 'teste', function(err) {
            console.log('customer.login called');

            if(err) return self.next(err);

            self.data = {
                loginMessage: 'Login Successful!',
                customerName: session.customer.firstname + ' ' + session.customer.lastname,
                customerData: JSON.stringify(session.customer)
            }

            self.render();

        });

    },
    logout: function() {

        var self = this;
        var session = this.req.session;

        self.template = 'common/customer-test';

        var Customer = require('../../engine/Customer.class');

        var customer = new Customer(self.req);
        console.log('New Customer instance created');

        customer.logout();

        self.data = {
            loginMessage: 'Logout Successful!'
        }

        self.render();


    },
    renderAsPartial: function(origCallback) {
        var self = this;

        self.data = {
            title: 'Second title',
        };

        self.modelCustomer = new (require('../../model/account/CustomerModel.class'))(self.req, self.res);

        async.waterfall([

            function(callback) {

                var customerData = {
                    firstname: 'Victor',
                    lastname: 'Schröder',
                    email: 'schrodervictor@gmail.com',
                    telephone: '+00 000 0000 0000',
                    password: 'teste',
                    cart: {},
                    wishlist: {},
                    newsletter: true,
                    addresses: [
                        {  },
                        {  }
                    ],
                    groups: ['default'],
                    ips: ['127.0.0.1'],
                    additionalFields: {},
                };

                self.modelCustomer.addCustomer(customerData, function(err, result){
                    if(err) return callback(err);
                    self.res.locals.newId = result[0]._id;
                    callback();
                });
            
            },
            function(callback) {

                //self.modules = self.model.getModules();
                self.modules = {
                    cart: 'module/cart',
                    language: 'module/language',
                    currency: 'module/currency',
                };

                self.renderedPartials(self.modules, function(err, result){
                    callback();
                });
                
            }
        ], function(err) {
            if(err) return origCallback(err);
            self.render(origCallback);
        });

    },
});

module.exports = HeaderController;