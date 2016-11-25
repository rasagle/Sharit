var express = require('express');
var pg = require('pg');
var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

/* GET home page. */
router.get('/', function(req, res) {
	
	pool.connect(function(err, client, done) {
		if (err) console.log('Failed to connect to database');
		client.query('SELECT * FROM users.user', function(err, result) {
			if (err) console.log('Query error');
			done();
			res.render('index');
	});
});
});

module.exports = router;
