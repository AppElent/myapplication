//
const db = require('../config/db.config.js');
var moment = require('moment-timezone');
const path = require("path");

const fetch = require("node-fetch");


exports.updateMeterstanden = async (req, res) => {

	let meterstanden = await db.multimeter.findAll({
	  where: {
		DeviceRowID: 3
	  }
	});
	
	//console.log('meterstanden', meterstanden);
	
	const lastentry = await db.meterstanden.findAll({
		limit: 1,
		where: {
			//your where conditions, or without them if you need ANY entry
			
		},
		order: [ [ 'datetime', 'DESC' ]]
	})
	console.log('Meterstanden moeten vanaf ' + lastentry[0].datetime + ' worden bijgewerkt');
	
	if(req.params.force !== 'force'){
		meterstanden = meterstanden.filter((item) =>
			new Date(item.Date) >= (new Date(lastentry[0].datetime))
		);
	}

	
	//console.log('test', meterstanden);
	
	
	for(const stand of meterstanden){
		datum = new Date(stand.Date);
		datum.setSeconds(0);
		
		var coeff = 1000 * 60 * 5;
		var date = new Date(datum);  //or use any other date
		var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
		console.log(datum, stand.Date, rounded);

		values = {
			datetime: rounded,
			180: ((stand['181'] + stand['182'])),
			181: stand['181'], 
			182: stand['182'],
			280: ((stand['281'] + stand['282'])),
			281: stand['281'],
			282: stand['282'],
		}
		//console.log(values);
		var gevondenmeterstand = await db.meterstanden.findOne({ where: {datetime: rounded} });
		if(gevondenmeterstand == null){
			gevondenmeterstand = await db.meterstanden.create(values);
			//console.log("Moet toegevoegd worden");
		}else{
			gevondenmeterstand = await gevondenmeterstand.update(values);
			//console.log("Moet geupdate worden");
		}

	}
	
	const allm = await db.meterstanden.findAll({
		where: {
			datetime: {
			$gte: moment().subtract(7, 'days').startOf('day').toDate()
			}
		}
	})
	
	res.send(allm);
}
