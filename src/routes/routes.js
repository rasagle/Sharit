var pg = require('pg');
var express = require('express');
var configDB = require('../config/database.js');
var router = express.Router;

var client = new pg.Pool(configDB);

// =====================================
// LOGIN ===============================
// =====================================
// show the login form


// process the login form
router.post('/login', function(req, res) {
	// login logic-db goes here; 
	// 1) search if username + password combination is correct
	client.query("SELECT email, password " + "FROM users " + "WHERE user.email=$1 AND user.pass=$2", [req.email, hash(req.password]))
	.then((result)=> {
		if (result.rows.length == 1)
			res.render('profile.ejs');
	})
	.catch((err) => {
		console.log('Query error');
		res.send('Wrong email or password');
	});
	
});

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
// process the signup form
router.post('/signup', function(req, res) {
	// signup logic-db goes here; 
	// 1) search if user/email exists
	// 2) insert into DB if new user	
	client.query('SELECT username, email FROM users.user WHERE username = $1 and email = $2', [req.username, req.email]) // check if username + email exists
	.then((result) => {
		if (result.rows.length == 0) { // if none exists, signup available
			client.query('INSERT INTO users.user VALUES($1, $2, $3, $4, $5, $6, $7', [req.username, salt, hash(req.password), req.firstname, req.lastname, req.email, req.org]) // signup
			.then((result) => {
				res.render('profile.ejs'); // redirect whatever successful signup is
			})
			.catch((err) => {
				console.log('Query Error');
			});
		}
		else
			res.send("Email is taken");
	})
	.catch((err) => {
		console.log("Query error");
	});
	
});

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user : req.user });
    console.log(req.user);
    
});

module.exports = router;