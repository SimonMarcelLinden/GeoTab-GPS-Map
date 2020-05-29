window.addEventListener('load', function() {
    console.log('Ready to start')

    /* create Socket.io Object */
    let socket = io();

    /* Receive data from Server */
    socket.on('ServerToClient', function (data) {
        document.getElementsByClassName('content')[0].textContent = data;
    });
});