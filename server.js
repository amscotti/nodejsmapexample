var express = require('express');
var socket = require('socket.io');

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

app.listen(8080);
console.log("Express server listening on port %d", app.address().port);

//Socket.io
var io = socket.listen(app); 
io.on('connection', function(socket){

  socket.on('add', function(message){
    console.log("ID: " + socket.id + " latitude = " + message.latitude + " longitude = " + message.longitude);
    io.sockets.emit("add", {'id': socket.id,  'latitude': message.latitude, 'longitude': message.longitude});
  });
		
	//Remove client from Google Map 
	socket.on('disconnect', function(){
	  io.sockets.emit("remove", {'id': socket.id});
	});
	 
});


