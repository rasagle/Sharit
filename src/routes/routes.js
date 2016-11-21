var pg = require('pg');
var conString = "postgres://sharit@localhost/";
var client = new pg.Client(conString);
client.connect();

module.exports = function(app) {
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
        res.render('index.ejs');
    });
	
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
       res.render('login.ejs'); 
    });
	
	// process the login form
	app.post('/login', function(req, res) { {
		// login logic-db goes here; 
		// 1) search if username + password combination is correct
		
		client.query("SELECT user.email, user.password " + "FROM users " + "WHERE user.email=$1 AND user.pass=$2", [req.email, req.password])
		.then((result)=> {
			return done(null, result);
		})
		.catch((err) => {
			log.error("/login: " + err);
			return done(null, false, {message:'Wrong email or password'});
		});
	}));
	
	// =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
	app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs');
    });
	
	// process the signup form
    app.post('/signup', function(req, res) {
		// signup logic-db goes here; 
		// 1) search if user/email exists
		// 2) insert into DB if new user
		
		client.query('SELECT $1 FROM users.email', [req.email], function(err, res) {
			if (err) {
				console.log('Query error'); // proceed to sign up
			}
			else if (res.rows.length == 0) { // email does not exist; is available to signup
				client.query('INSERT INTO users(email, username, password) VALUES($1, $2)', [req.email, req.username, req.password], function (err, res) {
			}
			done();
			console.log(res);
		});
    }));

	// =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', { user : req.user });
        console.log(req.user);
    });

	// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
	});

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
		if (req.isAuthenticated()) {
			console.log('isLoggedin');
			return next();
		}
		console.log('is not logged in');
		// if they aren't redirect them to the home page
		res.redirect('/');
	}
	
	// app.get('/logout', function(req, res){
		// var name = req.user.username;
		// console.log("LOGGED OUT " + req.user.username)
		// req.logout();
		// res.redirect('/');
		// req.session.notice = "You have successfully been logged out " + name + "!";
	// });
	
};