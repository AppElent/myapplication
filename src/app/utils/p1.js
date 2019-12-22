const db = require('../config/db.config.js');
const MeterstandElektra = db.meterstanden;

async function setData(data) {
    console.log(data);
    const datum = new Date();
    const minute = datum.getMinutes();
    console.log(minute);
    datum.setSeconds(0);
    if (minute < 15) {
        console.log('kleiner dan 15');
        datum.setMinutes(0);
    } else if (minute < 30) {
        console.log('Kleiner dan 30');
        datum.setMinutes(15);
    } else if (minute < 45) {
        console.log('Kleiner dan 45');
        datum.setMinutes(30);
    } else {
        console.log('Kleiner dan 60');
        datum.setMinutes(45);
    }
    console.log(datum);
    let stand = await MeterstandElektra.findOne({ where: { datetime: datum } });
    if (stand === null) {
        const values = { datetime: datum, kwh_180: '12345' };
        stand = await MeterstandElektra.create(values);
    }
    return stand;
}
