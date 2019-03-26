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
				kwh_180: ((stand.kwh_181 + stand.kwh_182)),
				kwh_181: stand.kwh_181, 
				kwh_182: stand.kwh_182,
				kwh_280: ((stand.kwh_281 + stand.kwh_282)),
				kwh_281: stand.kwh_281,
				kwh_282: stand.kwh_282,
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
