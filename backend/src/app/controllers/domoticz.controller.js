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
	
	const lastentry = await db.meterstanden.findOne({
		where: {
			//your where conditions, or without them if you need ANY entry
			user: '00uaz3xmdoobfWWnY356'
		},
		order: [ [ 'datetime', 'DESC' ]]
	})
	let lastdate = moment().add(-1, 'days')
	if(lastentry !== null){
		console.log('Meterstanden moeten vanaf ' + moment(lastentry.datetime).format('YYYY-MM-DD HH:mm') + ' worden bijgewerkt');
		lastdate = lastentry.datetime;
	}
	
	
	if(req.params.force !== 'force'){
		meterstanden = meterstanden.filter((item) =>
			new Date(item.Date) >= (new Date(lastdate))
		);
	}

	
	//console.log('test', meterstanden);
	
	
	for(const stand of meterstanden){
		let datum = new Date(stand.Date);
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
			user: '00uaz3xmdoobfWWnY356'
		}
		//console.log(values);
		var gevondenmeterstand = await db.meterstanden.findOne({ where: {datetime: rounded, user: '00uaz3xmdoobfWWnY356'} });
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
