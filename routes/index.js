var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello World!' });
});

/* GET New User Form. */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});

/* POST Add User. */
router.post('/adduser', function(req, res) {
    var db = req.db;

    var userName = req.body.username;
    var userEmail = req.body.useremail;

    var collection = db.get('users');

    collection.insert({
        "username": userName,
        "email": userEmail
    }, function(err, doc) {
        if (err) {
            res.send('There was a problem adding information do DB');
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
        res.render('userlist', {
            "userlist": docs
        });
    });
});

module.exports = router;
