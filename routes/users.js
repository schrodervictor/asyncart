var express = require('express');
var router = express.Router();

/* GET userlist */
router.get('/userlist', function(req, res) {
  var db = req.db;
  db.collection('users').find().toArray(function(err, items) {
  	res.json(items);
  });
});

/* POST to adduser */
router.post('/adduser', function(req, res) {
  var db = req.db;
  db.collection('users')
  	.insert(req.body, function(err, result) {
  		res.send(
  			(err === null) ? {msg: ''} : {msg:err}
  		);
  	});
});

/* DELETE to deleteuser */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var userToDelete = req.params.id;
  db.collection('users')
  	.removeById(userToDelete, function(err, result) {
  		res.send(
  			(result === 1) ? {msg: ''} : {msg:err}
  		);
  	});
});

module.exports = router;
