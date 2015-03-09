var redis = require('redis');
var client = redis.createClient(); //creates a new client 

client.on('connect', function() {
    console.log('connected');
	
	client.set('num', 1, function(err, reply) {
	  console.log(reply);
	});
	
	for(var i = 0; i < 1337; i++)
	{
		client.incrby('num', 1, function(err, reply) {
			console.log(reply);
		});
	}
	
	client.get('num', function(err, reply) {
		console.log(reply);
	});
});