var request = require('request');

var jsonBody = {
	subdomain_id: "1",
	title: "test",
	author: "admin",
	context: "this is a test"
}

request({
	url: 'http://localhost:3000/createThread',
	method: 'post',
	json: true,
	body: jsonBody
}, function (error, response, body) {
	console.log(response);
});