var pg = require('pg');
var clientDB = "postgres://sharit@localhost/auth";
var client = new pg.Client(clientDB);



function User() {
	this.email = "";
	this.password = "";
	
}

// INCOMPLETE