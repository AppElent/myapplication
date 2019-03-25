//
const db = require('../config/db.config.js');
var moment = require('moment');
const path = require("path");

const fetch = require("node-fetch");


exports.updateMeterstanden = async (req, res) => {
	//console.log(req);
	const url = "https://ericjansen.dynu.net/api/domoticz/multimeter?DeviceRowID=3";
	const response = await fetch(url);
	//console.log(response);
	const meterstanden = await response.json();
	
	for(const stand of meterstanden){
		datum = new Date(stand.Date);
		datum.setSeconds(0);
		console.log(datum, stand.Date);
		
		if([15, 30, 45, 0].includes(datum.getMinutes())){
			//console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
			//console.log(stand, datum);
			
			values = {
				datetime: datum,
				kwh_180: ((stand.Value1 + stand.Value5)/1000),
				kwh_181: stand.Value1/1000, 
				kwh_182: stand.Value5/1000,
				kwh_280: ((stand.Value2 + stand.Value6)/1000),
				kwh_281: stand.Value2/1000,
				kwh_282: stand.Value6/1000,
			}
			//console.log(values);
			var gevondenmeterstand = await db.meterstanden.findOne({ where: {datetime: datum} });
			if(gevondenmeterstand == null){
				gevondenmeterstand = await db.meterstanden.create(values);
				//console.log("Moet toegevoegd worden");
			}else{
				gevondenmeterstand = await gevondenmeterstand.update(values);
				//console.log("Moet geupdate worden");
			}
		}

	}
	
	res.send("ok");
}