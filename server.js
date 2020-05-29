/*  import express and http modules. */
let express     = require('express');
let GeotabApi   = require('mg-api-js');
let config      = require('./config');

let app     = express();
let server  = require('http').createServer(app);

/* import Socket.io */
let io = require('socket.io')(server);
/* set port */
let port = process.env.PORT || 8080;

const authentication = {
    credentials: {
        userName: config.username,
        password: config.password,
    },
    path: config.server,
}

const options = {
    rememberMe      : true, // Determines whether or not to store the credentials/session in the datastore
    fullResponse    : false, // Removes error handling and provides full Axios Response Object. More information in the Axios Response section
}

const api = new GeotabApi(authentication, options);

// start Webserver on port 8080.
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