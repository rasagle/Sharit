var express = require('express');
var pg = require('pg');
var bcrypt = require('bcryptjs');
var router = express.Router();

var configDB = require('../config/dbconfig.js');
var pool = new pg.Pool(configDB);

var defaultSub = {
	Bio: 1,
	Math: 2,
	CS: 3,
	Chem: 4
}

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
		var domainInsert = 'INSERT INTO permissions.domain_user VALUES($1, $2, $3)';
		var subInsert = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, $3)';

		client.query(queryFind, [username], function(err, result){
			if(err){
				console.log('Error running query', err);
				res.send('');
			}
			if(result.rows.length === 0){
				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result){
					done();
					if(err){
						console.log('Error running query', err);
						res.send('');
					}
					console.log(result.rows);
					res.json(result.rows[0]);
					client.query(domainInsert, [1, username, false], function(err, result){
						if(err) console.log('Error running query', err);
						for(var key in defaultSub){
							client.query(subInsert, [defaultSub[key], username, false]);
						}
						done();
					});

				});
			}else{
				done();
				res.send('');
			}
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
				var hash = bcrypt.hashSync(req.body.password, result.rows[0].salt);
				client.query(validLogin, [req.body.username, hash], function(err, result){
					if(result.rows.length != 0){
						console.log(result.rows[0]);
						res.json(result.rows[0]);
					}
					else
						res.send('');
				});
			}else{
				res.send('');
			}
			done();
		});
	});
});

router.post('/getDomain', function(req, res){
	var findDomains = 'SELECT name, id from permissions.domain_user NATURAL JOIN domains.domain WHERE username = $1';
	console.log(req.body);
	pool.connect(function(err, client, done){
		client.query(findDomains, [req.body.username], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

router.post('/getsubDomain', function(req, res){
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	console.log(req.body);
	pool.connect(function(err, client, done){
		client.query(findsubDomains, [req.body.username], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

// given author, subdomain_id,
// find thread
router.post('/findThread', function(req, res){
	var findThreads = 'SELECT subdomain_id, author from posts.thread WHERE subdomain_id = $1, author = $2';
	console.log(req.body);
	pool.connect(function(err, client, done){
		client.query(findThreads, [req.body.subdomain_id, req.body.username], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

// given sudomain_id, author, date_posted, comment, points, stickied or not,
// create thread
// note: "comment" in this sense is context, the body of the thread OP
router.post('/createThread', function(req, res){
	var createThread = 'INSERT INTO posts.thread(subdomain_id, author, date_posted, comment, points, stickied) VALUES($1, $2, $3, $4, $5, $6)';
	console.log(req.body);
	pool.connect(function(err, client, done){
		client.query(createThread, [req.body.subdomain_id, req.body.author, req.body.date_posted, req.body.comment, req.body.points, req.body.sticked], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

// given thread_id, comment_id, author, current_timestamp, comment, points,
// create comment

router.post('/createComment', function(req, res){
	var createComment = 'INSERT into posts.comment(thread_id, comment_id, author, current_timestamp, comment, points) values($1, $2, $3, $4, $5, $6)';
	console.log(req.body);
	pool.connect(function(err, client, done){
		client.query(createComment, [req.body.thread_id, req.body.comment_id, req.body.author, req.body.current_timestamp, req.body.comment, req.body.points], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

module.exports = router;