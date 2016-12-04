var express = require('express');
var pg = require('pg');
var bcrypt = require('bcryptjs');

var fs = require('fs');
var multer = require('multer');

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/var/lib/postgresql/9.5/main')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname + '-' + Date.now())
//   }
// })

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
	if(user){
		console.log(user);	
		res.render('initial', {nav: req.session[user].nav, subnav: req.session[user].subnav, logged: false, user: user});
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
				console.log('Error running query', err);
				return res.render('error', {error: err})
			}
			if(result.rows.length === 0){
				client.query(queryInsert, [username, hash, first_name, last_name, email, phone, company, salt], function(err, result){
					done();
					if(err){
						console.log('Error running query', err);
						return res.render('error', {error: err})
					}
					console.log(result.rows);
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
	console.log(req.body);
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
	var findThreads = 'SELECT * from posts.thread WHERE subdomain_id = $1 ORDER BY points DESC';
	pool.connect(function(err, client, done){
		client.query(findThreads, [req.params.subid], function(err, result){
			done();
			var user = req.params.user;
			console.log(user);
			res.render('index', {threads: result.rows, nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
		});
	});
});

// 2 user params: newPassword, username
// successfully updates password w/ new hash
router.post('/updatePassword', function(req, res){
	var updatePassword = 'UPDATE users.user SET password = $1 WHERE username = $2';
	console.log(req.body);
	var salt =  bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.newPassword, salt);
	pool.connect(function(err, client, done){
		client.query(updatePassword, [hash, req.body.username], function(err, result){
			console.log(result.rows);
			done();
			res.json(result.rows);
		});
	});
});

// 1 user param: username
// returns all domains user is a subscriber of
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

// 1 user param: username
// returns all subdomains user is a subscriber of
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

router.get('/NYU/:sub/:subid/:user/createThread', function(req, res){
	var user = req.params.user;
	res.render('createThread', {nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub});
});

// 5 user params: subdomain_id, title, author, context, file
// creates thread w/ file if attached
// file uploaded in postgres' default db folder
router.post('/NYU/:sub/:subid/:user/createThread', upload.single('file'), function(req, res){
	var createThread;
	console.log(req.body);

	pool.connect(function(err, client, done){
		if (!req.file) { // no file
			createThread = 'INSERT INTO posts.thread(subdomain_id, title, author, context) VALUES($1, $2, $3, $4)';
			
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context], function(err, result){
				if (err) console.log(err);
				console.log(result.rows);
				
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
		else { // there is file
			console.log(req.file);
			if (err) console.log(err);
			createThread = 'WITH created_thread_id AS ' + 
			'(INSERT INTO posts.thread(subdomain_id, title, author, context) ' + 
			'VALUES($1, $2, $3, $4) ' + 'RETURNING id) ' + 
			'INSERT INTO posts.file(thread_id, filename, data) ' + 
			'SELECT id, $5, pg_read_binary_file($6)::bytea ' + 
			'FROM created_thread_id';
			
			client.query(createThread, [req.params.subid, req.body.title, req.params.user, req.body.context, req.file.originalname, req.file.filename], function(err, result){
				if (err) console.log(err);
				console.log(result.rows);
					
				done();
				res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user);
			});
		}
	});
});

router.get('/downloadFile/:thread_id', function(req, res){
	var downloadFile = 'SELECT filename, data FROM posts.file WHERE thread_id = $1';

	pool.connect(function(err, client, done){
		client.query(downloadFile, [req.params.thread_id], function(err, result){
			// console.log(result.rows); // massive wall of text
			done();
			var filename = result.rows[0].filename;
    		var data = result.rows[0].data;
    		
    		res.set('Content-disposition', 'attachment;filename=' + filename);
    		res.send(new Buffer(data, 'binary'));
		});
	});
});

// reteive all comments, file and thread info
// 1 user param: thread_id
// returns all information about thread_id, file name and id (use downloadFile route to get file), comments
router.get('/NYU/:sub/:subid/:user/:thread_id', function(req, res){
	var user = req.params.user;
	var threads = 'SELECT * FROM posts.thread WHERE id = $1';
	var comments = 'SELECT * FROM posts.comment WHERE thread_id=$1 ORDER BY points DESC, date_posted DESC';
	var file = 'SELECT filename FROM posts.thread JOIN posts.file ON(thread.id = file.thread_id) WHERE thread_id = $1';

	pool.connect(function(err, client, done){
		client.query(threads, [req.params.thread_id], function(err, thread){
			client.query(comments, [req.params.thread_id], function(err, comments){
				client.query(file, [req.params.thread_id], function(err, filename){
					console.log(comments.rows);
					res.render('threadContent', {thread: thread.rows[0], comments: comments.rows, filename: filename.rows[0], nav: req.session[user].nav, subnav: req.session[user].subnav, user: user, subid: req.params.subid, sub: req.params.sub, thread_id: req.params.thread_id})
				});	
			});
		});
	});
});


// create comment
router.post('/NYU/:sub/:subid/:user/:thread_id', function(req, res){
	var createComment = 'INSERT into posts.comment(thread_id, author, comment) values($1, $2, $3)';
	pool.connect(function(err, client, done){
		client.query(createComment, [req.params.thread_id, req.params.user, req.body.comment], function(err, result){
			done();
			res.redirect('/NYU/' + req.params.sub + '/' + req.params.subid + '/' + req.params.user + '/' + req.params.thread_id);
		});
	});
});

function getPoints(client, id, res, done, query){
	client.query(query, [id], function(err, result){
		done();
		console.log(result.rows[0]);
		res.json(result.rows[0]);
	})
}

router.get('/voteThread/:user/:thread_id/:rating', function(req, res){
	console.log(req.body);
	var voteThread = 'INSERT INTO ratings."ThreadRating"(thread_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."ThreadRating" WHERE thread_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."ThreadRating" SET rating = $3 WHERE thread_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.thread WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.thread_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteThread, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.thread_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.thread_id, res, done, findPoints);
				});
			}
			done();
		});
	});
});

router.get('/voteComment/:user/:comment_id/:rating', function(req, res){
	console.log(req.body);
	var voteComment = 'INSERT INTO ratings."CommentRating"(comment_id, username, rating) VALUES($1, $2, $3)';
	var queryFind = 'SELECT username FROM ratings."CommentRating" WHERE comment_id = $1 and username = $2';
	var updateVote = 'UPDATE ratings."CommentRating" SET rating = $3 WHERE comment_id = $1 and username = $2';
	var findPoints = 'SELECT points FROM posts.comment WHERE id = $1';

	pool.connect(function(err, client, done){
		client.query(queryFind, [req.params.comment_id, req.params.user], function(err, result){
			if (result.rows.length === 0) { // user rating not found, so insert new rating
				client.query(voteComment, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			else {
				client.query(updateVote, [req.params.comment_id, req.params.user, req.params.rating], function(err, result){
					getPoints(client, req.params.comment_id, res, done, findPoints);
				});
			}
			done();
		});
	});
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