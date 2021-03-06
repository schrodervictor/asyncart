var config = require('../config')();
var MongoClient = require('mongodb').MongoClient;
var Store = require('express-session').Store;

function SessionStore() {

    var self = this;
    var DB;
    var error;
    MongoClient.connect('mongodb://' + config.mongo.host +
                        ':' + config.mongo.port +
                        '/' + config.mongo.database, function(err, db) {
        if(err) {
            console.log('Sorry, there is no MongoDB server running');
            throw new Error('No access to DB for sessionStore');
        } else {
            console.log('DB object attached for sessionStore');
            self.db = db;
            self.collection = self.db.collection('session');
        };
    });
}

SessionStore.prototype.__proto__ = Store.prototype;

SessionStore.prototype.constructor = SessionStore;

SessionStore.prototype.get = function(sid, callback) {
    
    console.log('SessionStore.get sid: ' + sid);

    this.collection.findOne({sid: sid}, function(err, doc) {
        if(err) return callback(err);

        // TODO Better treatment with invalid sid's
        if(!doc) return callback();

        if('sessionData' in doc) {
            callback(null, doc.sessionData);
        } else {
            callback();
        }
 
    });

}

SessionStore.prototype.set = function(sid, session, callback) {

    console.log('SessionStore.set sid: ' + sid);

    this.collection.update({sid: sid},
                           {sid: sid, sessionData: session},
                           {upsert: true, w:1}, function(err, result) {
        if(err) return callback(err);

        console.log('SessionStore.set result: ' + result);

        callback();

    });
}

SessionStore.prototype.destroy = function(sid, callback) {
    console.log('SessionStore.destroy sid: ' + sid);
    
    var callback = callback || function(){};

    this.collection.findAndRemove({sid: sid}, [['sid', 1]], function(err, result) {
        if(err) return callback(err);

        console.log('SessionStore.destroy result:' + result);

        callback();

    });

}


module.exports = (function() {

    return new SessionStore();

})();