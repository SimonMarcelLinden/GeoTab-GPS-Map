window.addEventListener('load', function() {
    console.log('Ready to start')

    let images = [
        '../img/car-marker-black.png',
        '../img/car-marker-blue.png',
        '../img/car-marker-fjordgreen.png',
        '../img/car-marker-green.png',
        '../img/car-marker-guardsred.png',
        '../img/car-marker-orange.png',
        '../img/car-marker-purple.png',
        '../img/car-marker-red.png',
        '../img/car-marker-turquoise.png',
        '../img/car-marker-yellow.png'
    ]

    /* Initialize marker for driver */
    let markers     = L.Icon.extend({
        options: {
            iconSize    : [48, 48],
            shadowSize  : [50, 64],
            iconAnchor  : [24, 24],
            shadowAnchor: [4, 62]
        }
    });
    let markerArray = {
        0: new markers({iconUrl: './img/car-marker-black.png'}),
        1: new markers({iconUrl: './img/car-marker-blue.png'}),
        2: new markers({iconUrl: './img/car-marker-fjordgreen.png'}),
        3: new markers({iconUrl: './img/car-marker-green.png'}),
        4: new markers({iconUrl: './img/car-marker-guardsred.png'}),
        5: new markers({iconUrl: './img/car-marker-orange.png'}),
        6: new markers({iconUrl: './img/car-marker-purple.png'}),
        7: new markers({iconUrl: './img/car-marker-red.png'}),
        8: new markers({iconUrl: './img/car-marker-turquoise.png'}),
        9: new markers({iconUrl: './img/car-marker-yellow.png'})
    };

    let mapMarker   = {};

    /* Initialize Map */
    let map = L.map('map', {
        center: [51.163361,10.447683],
        zoom: 6
    });

    /* Set tile layer */
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    /* create Socket.io Object */
    let socket = io();

    /* Initialize map & marker */
    socket.on('MapInitialize', function (data) {
        mapMarker = { }
        $(".menu").html('');
        $.each( data, function( key, value ) {
            let html =  $('<li>').addClass('menu-home').attr('data-id', key).append( $('<div>').addClass('item-container')
                .append( $('<img>').attr('src', images[value['imageID']]) ).append( $('<div>').addClass('text')
                    .append( $('<span>').text( value['name'] ) ) ) );
            $(".menu").append(html);

            let tempMarker = new L.marker([51.16, 10.45],     {icon: markerArray[value['imageID']]})
                .addTo(map)
                .bindPopup(value.name);
            //     .openPopup();
            mapMarker[key] = tempMarker
        });

        socket.emit('GPSUpdate');
    })

    /* Server receive gps location */
    socket.on('GPSUpdate', function (data) {

        $.each( data, function( key, value ) {
            let lat = value['gps']['lat'];
            let lng = value['gps']['long'];
            let newLatLng = new L.LatLng(lat, lng);
            let tempMarker = mapMarker[key]
            tempMarker.setLatLng(newLatLng)
        });
    })

    setInterval(function(){ socket.emit('GPSUpdate'); }, 3600000 )

    /* Send client initialize */
    socket.emit('ClientInitialize');
});