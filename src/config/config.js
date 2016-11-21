var dbConfig = {
	user: 'postgres',
	database: 'sharit',
	password: 'root',
	host: 'localhost',
	port: 5432,
	max: 100,
	idleTimeoutMillis: 30000
}

var pool = new pg.Pool(dbConfig);

module.exports = function(app) {
	
	pool.connect(function(err, client, done) {
		if (err) console.log('Failed to connect to database');
		client.query('SELECT * FROM users.user', function(err, res) {
			if (err) console.log('Query error');
			done();
			console.log(res);
		});
	});
};