module.exports = class GPS {

    constructor() {
        this.data = {}
        this.index = 0
    }

    exists(id){
        return id in this.data;
    }

    addDriver(id, name, gps = {'lat': 0, 'long': 0}) {
        this.data[id] = {
            'name' : name,
            'gps' : {
                'lat' : gps.lat,
                'long': gps.long
            },
            'imageID' : this.index
        };
        ( this.index >= 10 ) ? this.index = 0 : this.index++
    }

    setGPS (id, gps = {'lat': 0, 'long': 0}) {
        this.data[id]['gps']['lat']     = gps.lat
        this.data[id]['gps']['long']    = gps.long
    }
}