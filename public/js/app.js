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
        zoom  : 6
    });

    /* Set tile layer */
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    L.tileLayer(streetMap('streets'), {
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: 'Kartendaten <a href="https://www.google.com/intl/de/help/terms_maps/">Google Maps</a>'
    }).addTo(map);

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

        let time = getTime()
        $('.time span').text(time)
    })

    setInterval(function(){ socket.emit('GPSUpdate'); }, 3600000 )

    /* Send client initialize */
    socket.emit('ClientInitialize');
});

function getTime() {
    let time = new Date();

    return time.getFullYear() + '-' +
        ("0" + (time.getMonth() + 1)).slice(-2) + '-' +
        ("0" + (time.getDate())).slice(-2) + ' ' +
        ("0" + time.getHours()).slice(-2) + ':' +
        ("0" + time.getMinutes()).slice(-2) + ':' +
        ("0" + time.getSeconds()).slice(-2);
}

function streetMap(type = 'normal'){
    switch (type) {
        case 'normal':
            return 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        case 'streets':
            return 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        case 'hybrid':
            return 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
        case 'satellite':
            return 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        case 'terrain':
            return 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
        case 'traffic':
            return 'https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}';
    }
}