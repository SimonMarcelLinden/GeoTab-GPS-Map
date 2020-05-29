/*  import express and http modules. */
let express     = require('express');
let GeotabApi   = require('mg-api-js');
let config      = require('./config');

let app     = express();
let server  = require('http').createServer(app);

/* import Socket.io */
let io = require('socket.io')(server);
/* import gps class */
let gps       = require('./GPS');
let GPS         = new gps()

/* set port */
let port = process.env.PORT || 8080;

/* Geotab configuartion */
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

let login = false

api.authenticate( (success) => {
    console.info('GeoTab successful authentication');
    login = true
}, (error) => {
    console.info('GeoTab something went wrong');
    login = true
})

// start Webserver on port 8080.
server.listen(port, function () {
    console.info('Webserver run and listening on port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    let finish = false

    socket.on('ClientInitialize', function () {
        console.info('Initialize GPS and Driver...');
        ClientInitialize()
    })

    socket.on('GPSUpdate', function () {
        console.info('GPS update...');
        if ( finish )
            GPSUpdate()
    })

    async function ClientInitialize () {
        if (login) {
            api.call('Get', {
                typeName: 'User',
                search : {
                    "isDriver" : "true"
                }
            }, function (result) {
                result.forEach( function( item ) {
                    let id      = item['id']
                    let name    = item['lastName']

                    if( !GPS.exists( id ))
                        GPS.addDriver(id, name)
                });
                socket.emit( 'MapInitialize', GPS.data );
                finish  = true
            }, function (err) {
                console.error(err);
            });
        }
    }

    async function GPSUpdate () {
        if (login) {
            api.call('Get', {
                typeName: 'DeviceStatusInfo',
            }, function (result) {
                result.forEach(function (item) {
                    let id = item['driver']['id']
                    if (GPS.data[id]) {
                        let gps = {
                            'lat': item['latitude'],
                            'long': item['longitude']
                        }
                        GPS.setGPS(id, gps)
                    }
                })

                socket.emit('GPSUpdate', GPS.data);
            }, function (err) {
                console.error(err);
            });
        }
    }
});