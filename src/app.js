var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
var config = {
	user: 'postgres',
	database: 'Sharit',
	password: 'root',
	host: 'localhost',
	port: 5432,
	max: 100,
	idleTimeoutMillis: 30000
}
var connect = "postgres://postgres:root@localhost/Sharit";

var pool = new pg.Pool(config);

//settting static files
var staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

//use body-parser
app.use(bodyParser.urlencoded({extended: false}));

//setting view engine
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;

//requiring routes
var api = require('./routes.js');

app.get('/', function(req, res){
	pool.connect(function(err, client, done){
		if(err)
			return res.send('You goofed');
		client.query('SELECT * FROM users.user', function(err, result){
			if(err)
				return res.send('query error');
			done();
			console.log(result);
			res.render('index.ejs');
		});
	});

});

app.get('/*', function(req, res){
	res.render('index.ejs');
});

app.listen(port, function(){
	console.log('Listening to port', port);
});