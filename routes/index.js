var express = require('express');
var pg = require('pg');
var bcrypt = require('bcryptjs');

var fs = require('fs');
var multer = require('multer');

var isWin = /^win/.test(process.platform);

var destStr = isWin ? 'C:/Program Files/PostgreSQL/9.6/data' : '/var/lib/postgresql/9.5/main';

var upload = multer({ dest: destStr })

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
	var user = req.query.username;
	var findAllThreads = 'SELECT subdomain_id, username, thread.id, author, date_posted, title, context, points, name, filename ' +
	'FROM (permissions.subdomain_user natural join posts.thread natural join posts.file) join domains.subdomain on(thread.subdomain_id = subdomain.id) WHERE username = $1 ORDER BY points DESC, date_posted DESC';
	var findSubUserNotIn = 'select id, name from domains.subdomain where id not in'+
'		(select subdomain_id from permissions.subdomain_user where username=$1) order by name;';
	if(user){
		pool.connect(function(err, client, done){
			client.query(findAllThreads, [user], function(err, result){
				client.query(findSubUserNotIn, [user], function(err, subs){
					done();
					res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: false, user: user, threads: result.rows, subs: subs.rows});
				})
			});
		});
		//res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: false, user: user});
	}else{
		res.render('initial', {logged: true});
	}
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/register', function(req, res){
	res.render('register');
});

router.post('/register', function(req, res){
	var salt =  bcrypt.genSaltSync(10);
	var {username, password, first_name, last_name, email, phone, company} = req.body;
	var hash = bcrypt.hashSync(password, salt);
	var queryFind = 'SELECT username FROM users.user WHERE username=$1';
	var queryInsert = 'INSERT INTO users.user(username, hash, first_name, last_name, email, phone, company, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING username';
	var domainInsert = 'INSERT INTO permissions.domain_user VALUES($1, $2, $3)';
	var subInsert = 'INSERT INTO permissions.subdomain_user VALUES($1, $2, $3)';
	pool.connect(function(err, client, done){

		client.query(queryFind, [username], function(err, result){
			if(err){
				return res.render('error', {error: err})
			}
			if(result.rows.length === 0){
				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result){
					done();
					if(err){
						return res.render('error', {error: err})
					}
					res.redirect('/');
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
				res.redirect('/register');
			}
		});
	});
});

router.post('/login', function(req, res){
	var findSalt = 'SELECT salt FROM users.user WHERE username=$1';
	var validLogin = 'SELECT * FROM users.user WHERE username=$1 and hash=$2';
	var findDomains = 'SELECT name, id from permissions.domain_user NATURAL JOIN domains.domain WHERE username = $1';
	var findsubDomains = 'SELECT name, id from permissions.subdomain_user as perm JOIN domains.subdomain as dom ON(perm.subdomain_id = dom.id) WHERE username = $1';
	pool.connect(function(err, client, done){
		if(err){
			console.log('Error running query', err);
			return res.render('error', {error: err})
		}
		client.query(findSalt, [req.body.username], function(err, result){
			if(err){
				console.log('Error running query', err);
				return res.render('error', {error: err})
			}
			if(result.rows.length !== 0){
				var hash = bcrypt.hashSync(req.body.password, result.rows[0].salt);
				client.query(validLogin, [req.body.username, hash], function(err, result){
					if(result.rows.length != 0){
						
						client.query(findDomains, [req.body.username], function(err, result){

							var domains = result.rows;
							client.query(findsubDomains, [req.body.username], function(err, result){

								done();
								var subs = result.rows;
								req.session[req.body.username] = {nav: domains, subnav: subs};
								res.redirect('/?username=' + req.body.username);
							});
						});

					}
					else
						return res.redirect('/login');
				});
			}else{
				return res.redirect('/login');
			}
			done();
		});
	});
});

router.get('/NYU/:sub/:subid/:user', function(req, res){
	if(! req.session.hasOwnProperty(req.params.user)){
		res.redirect('/');
		return;
	}
	var findThreads = 'SELECT subdomain_id, thread.id, author, date_posted, title, context, points, filename from posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE subdomain_id = $1 ORDER BY points DESC';
	pool.connect(function(err, client, done){
		client.query(findThreads, [req.params.subid], function(err, result){
			done();
			var user = req.params.user;
			res.render('index', {threads: result.rows, nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
		});
	});
});

// 2 user params: newPassword, username
// successfully updates password w/ new hash
router.post('/updatePassword', function(req, res){
	var updatePassword = 'UPDATE users.user SET password = $1 WHERE username = $2';
	var salt =  bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.newPassword, salt);
	pool.connect(function(err, client, done){
		client.query(updatePassword, [hash, req.body.username], function(err, result){
			done();
			res.json(result.rows);
		});
	});
});

router.get('/logout/:user', function(req, res){
	delete req.session[req.params.user];
	res.redirect('/');
});


// Not done
// return top 10 threads of each subdomain user is in
// router.post('/getHotThreads', function(req, res){
// 	var hotThreads = 'SELECT * from posts.thread JOIN permissions.subdomain_user ON(username = $1) ORDER BY points DESC LIMIT 10';
// 	console.log(req.body);

// 	pool.connect(function(err, client, done){
// 		client.query(hotThreads, [req.body.username], function(err, result){
// 			console.log(result.rows);
// 			done();
// 			res.json(result.rows);
// 		});
// 	});
// });


// Not done
// return fresh 10 threads of each subdomain user is in
// router.post('/getFreshThreads', function(req, res){
// 	var getFreshThreads = 'SELECT * from posts.thread JOIN permissions.subdomain_user ON(username = $1) ORDER BY date_posted DESC LIMIT 10';
// 	console.log(req.body);

// 	pool.connect(function(err, client, done){
// 		client.query(getFreshThreads, [req.body.username], function(err, result){
// 			console.log(result.rows);
// 			done();
// 			res.json(result.rows);
// 		});
// 	});
// });


// Not done
// return all upvoted threads user upvoted
// router.post('/getUpvotedThreads', function(req, res){
// 	var getUpvotedThreads = 'SELECT * FROM posts.thread JOIN ratings.ThreadRating ON(thread_id) WHERE user AND (rating == 1)';
// 	console.log(req.body);

// 	pool.connect(function(err, client, done){
// 		client.query(getUpvotedThreads, [req.body.username], function(err, result){
// 			console.log(result.rows);
// 			done();
// 			res.json(result.rows);
// 		});
// 	});
// });


// 1 user param: username
// get all user's comment ever posted
router.post('/getCommentPosted', function(req, res){
	var userComments = 'SELECT * from posts.comment JOIN posts.thread ON(author = $1)';
	console.log(req.body);

	pool.connect(function(err, client, done){
		client.query(userComments, [req.body.username], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

module.exports = router;