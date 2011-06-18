/**
 * Module dependencies.
 */
var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index');
});


//Socket.io
var socket = io.listen(app); 
socket.on('connection', function(client){
    client.on('message', function(message){
        console.log("latitude = " + message.latitude);
		    console.log("longitude = " + message.longitude);
		    socket.broadcast({'type': "add", 'id': client.sessionId,  'latitude': message.latitude, 'longitude': message.longitude});
	});
	//Remove client from Google Map 
	client.on('disconnect', function(){
		socket.broadcast({'type': "remove", 'id': client.sessionId});
	}); 
});

app.listen(8080);
console.log("Express server listening on port %d", app.address().port);
