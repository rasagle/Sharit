var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js');

module.exports = function(passport) {
	
	// =========================================================================
    // PASSPORT SESSION SETUP ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
	
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		console.log("serialize", user);
        done(null, user.id);
    });
	
	// used to deserialize the user
    passport.deserializeUser(function(id, done) {
		console.log("deserialize", user);
        db.one("SELECT user_id, user_name, user_email, user_role FROM users " +
            "WHERE user_id = $1", [id])
		.then((user)=>{
			done(null, user);
		})
		.catch((err)=>{
		done(new Error("User with the id ${id} does not exist"));
		})
	});
	
	
	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

	}));
	
	
	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
	
	
	
	
	// passport.use('local-login', new LocalStrategy({
        // usernameField : 'email',
        // passwordField : 'password',
    // },
	// (username, password, done) => {
		// console.log("Login process:", username);
	// return db.one("SELECT user_id, user_name, user_email, user_role " +
        // "FROM users " +
        // "WHERE user_email=$1 AND user_pass=$2", [username, password])
		// .then((result)=> {
			// return done(null, result);
		// })
		// .catch((err) => {
			// log.error("/login: " + err);
			// return done(null, false, {message:'Wrong user name or password'});
			// });
		// })
	// );

};