var config = require(__config)();

function Mailer(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;

    this.email = {};

    this.mailer = require('nodemailer');

}

Mailer.prototype.getTransport = function() {

    // This method is only to allow the transport
    // configuration for all methods in a single place
    
    // TODO This kind of transporter is only a provisory solution
    // It's common to e-mail services to think it's a spam
    return this.mailer.createTransport();

}


Mailer.prototype.send = function(email, to, from, callback) {

    // The expected object is like this:
    /*
        var email = {
            from: "Asyncart <foo@foo.com>", // sender address
            to: "schrodervictor@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world ✔", // plaintext body
            html: "<b>Hello world ✔</b>" // html body
        }
    */

    email.to = to || email.to;

    email.from = from || email.from || config.defaultEmail;

    var transport = this.getTransport();

    // send mail with defined transport object
    transport.sendMail(email, callback || function(error, response) {
        if(error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        transport.close();

    });

}


module.exports = function(req, res, next) {
    req.mailer = new Mailer(req, res, next);
    console.log('Mailer object created in req.mailer');
    next();
}