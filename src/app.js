var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

//settting static files
var staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

//setting view engine
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;

//requiring routes
var api = require('./routes.js');

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/*', function(req, res){
	res.render('index.ejs');
});

app.listen(port, function(){
	console.log('Listening to port', port);
});