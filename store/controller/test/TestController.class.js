var config = require(__config)();
var Controller = require(config.enginePath + '/Controller.class');
var async = require('async');

var TestController = (new Controller()).extend({
    exposedActions: {
        init: false,
        customer: true,
        logout: true,
        login: true,
        create: true
    },
    init: function() {
        this.req = arguments[0];
        this.res = arguments[1];
        this.next = arguments[2];

        this.groupName = 'common';
        this.controllerName = 'test';
        this.route = 'test/test';
        this.template = 'test/test';
        this.data = {};
    },
    login: function() {
        console.log('Inside method login in TestController');
        var self = this;
        var session = this.req.session;
        self.template = 'test/customer-test';

        var Customer = require('../../engine/Customer.class');

        var customer = new Customer(self.req);
        console.log('New Customer instance created');

        customer.login('schrodervictor@gmail.com', 'teste', function(err) {
            console.log('customer.login called');

            if(err) return self.next(err);

            self.data = {
                message: 'Login Successful!',
                info1: session.customer.firstname + ' ' + session.customer.lastname,
                info2: JSON.stringify(session.customer)
            }

            self.render();

        });

    },
    logout: function() {

        var self = this;
        var session = this.req.session;

        self.template = 'test/customer-test';

        var Customer = require('../../engine/Customer.class');

        var customer = new Customer(self.req);
        console.log('New Customer instance created');

        customer.logout();

        self.data = {
            message: 'Logout Successful!'
        }

        self.render();


    },
    create: function() {
        var self = this;

        self.template = 'test/customer-test';

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
                    self.data.message = 'Customer created!';
                    self.data.info1 = result[0]._id;
                    callback();
                });
            
            },
            function(callback) {

                self.renderedPartials(self.modules, function(err, result){
                    callback();
                });

            }
        ], function(err) {
            if(err) return self.next(err);
            self.render();
        });

    },

    renderAsPartial: function(origCallback) {
        var self = this;

        async.waterfall([

            function(callback) {
                callback();
            },
            function(callback) {
                callback();
            }
        ], function(err) {
            if(err) return origCallback(err);
            self.render(origCallback);
        });

    },
});

module.exports = TestController;