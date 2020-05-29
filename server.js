/*  import express and http modules. */
let express = require('express');

let app     = express();
let server  = require('http').createServer(app);

/* import Socket.io */
let io = require('socket.io')(server);
/* set port */
let port = process.env.PORT || 8080;

// start Webserver pn port 8080.
server.listen(port, function () {
    console.info('Webserver run and listening on port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {

    socket.emit( 'ServerToClient', 'Hello World' );

    socket.on('ClientToServer', function () {
        console.log('Receive from Client');
    })
});