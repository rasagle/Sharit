var express  = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var port = process.env.PORT || 3000;
var app = express();

// Database Config
var configDB = require('./config/database.js');
var pool = new pg.Pool(configDB);
pool.connect(function(err, client, done) {
	if (err) console.log('Failed to connect to database');
	client.query('SELECT * FROM users.user', function(err, res) {
		if (err) console.log('Query error');
		done();
		console.log(res);
	});
});

// Express Config
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Config
require('./routes/routes.js')(app);

app.listen(port, function(){
	console.log('Listening to port', port);
});