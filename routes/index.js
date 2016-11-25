var express = require('express');
var pg = require('pg');
var bcrypt = require('bcryptjs');
var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.post('/register', function(req, res){
	var salt =  bcrypt.genSaltSync(10);
	var {username, password, first_name, last_name, email, phone, company} = req.body;
	var hash = bcrypt.hashSync(password, salt);

	pool.connect(function(err, client, done){
		var queryFind = 'SELECT username FROM users.user WHERE username=$1';
		var queryInsert = 'INSERT INTO users.user(username, hash, first_name, last_name, email, phone, company, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING username';

		client.query(queryFind, [username], function(err, result){
			if(err){
				console.log('Error running query', err);
				res.send('');
			}
			if(result.rows.length === 0){
				client.query(queryInsert, [username, password, first_name, last_name, email, phone, company, salt], function(err, result){
					done();
					if(err){
						console.log('Error running query', err);
						res.send('');
					}
					console.log(result.rows);
					res.json(result.rows[0]);
				});
			}
			done();
			res.send('');
		});
	});
});

router.post('/login', function(req, res){
	var findSalt = 'SELECT salt FROM users.user WHERE username=$1';
	var validLogin = 'SELECT * FROM users.user WHERE username=$1 and hash=$2';
	console.log(req.body);
	pool.connect(function(err, client, done){
		if(err){
			console.log('Error running query', err);
			res.send('');
		}
		client.query(findSalt, [req.body.username], function(err, result){
			if(err){
				console.log('Error running query', err);
				res.send('');
			}
			if(result.rows.length !== 0){
				client.query(validLogin, [req.body.username, req.body.password], function(err, result){
					if(result.rows.length != 0)
						res.json(result.rows[0]);
					else
						res.send('');
				});
			}
			done();
			res.send('');
		});
	});
});

module.exports = router;
