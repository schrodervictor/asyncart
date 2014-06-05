var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.jade', { title: 'NodeCart' });
});

/* GET Hello World. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld.jade', { title: 'Hello World!' });
});

/* GET New User Form. */
router.get('/newuser', function(req, res) {
  res.render('newuser.jade', { title: 'Add New User' });
});

/* POST Add User. */
router.post('/adduser.jade', function(req, res) {
    var db = req.db;

    var userName = req.body.username;
    var userEmail = req.body.useremail;

    var collection = db.get('users');

    collection.insert({
        "username": userName,
        "email": userEmail
    }, function(err, doc) {
        if (err) {
            res.send('There was a problem adding information in DB');
        } else {
            res.location('userlist');
            res.redirect('userlist');
        }
    });
});

/* GET userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    console.log(collection);
    collection.find({},{}, function(err, docs) {
        console.log(docs);
        res.render('userlist.jade', {
            "userlist": docs
        });
    });
});

module.exports = router;
