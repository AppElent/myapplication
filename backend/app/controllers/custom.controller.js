const db = require('../config/db.config.js');
const Rekening = db.rekeningen;
const PythonShell = require('python-shell')
const MeterstandElektra = db.meterstandenelektra;
var moment = require('moment');

// Start a run
exports.run = (req, res) => {	
	let options = {
	  mode: 'text',
	  pythonPath: '/usr/local/bin/python3.7',
	  //pythonOptions: ['-u'], // get print results in real-time
	  scriptPath: '/home/pi/bunq'
	};
	
	PythonShell.PythonShell.run('script.py', options, function (err, results) {
	  if (err) {res.status(500).send('error: ' + err);}else{
		// results is an array consisting of messages collected during execution
		
		results.forEach(function(item) {
		  item = item.replace(/(?:\r\n|\r|\n)/g, '<br>');
		});
		res.status(200).send(results);
	  }

});
};

// Alle rekeningen gegroepeerd per rekening
exports.groupedOverview = (req, res) => {
	Rekening.findAll({
   		attributes: ['rekening', 
     		[db.sequelize.fn('SUM', db.sequelize.col('januari')), 'totaal_1'],
		[db.sequelize.fn('SUM', db.sequelize.col('februari')), 'totaal_2'],
		[db.sequelize.fn('SUM', db.sequelize.col('maart')), 'totaal_3'],
		[db.sequelize.fn('SUM', db.sequelize.col('april')), 'totaal_4'],
		[db.sequelize.fn('SUM', db.sequelize.col('mei')), 'totaal_5'],
		[db.sequelize.fn('SUM', db.sequelize.col('juni')), 'totaal_6'],
		[db.sequelize.fn('SUM', db.sequelize.col('juli')), 'totaal_7'],
		[db.sequelize.fn('SUM', db.sequelize.col('augustus')), 'totaal_8'],
		[db.sequelize.fn('SUM', db.sequelize.col('september')), 'totaal_9'],
		[db.sequelize.fn('SUM', db.sequelize.col('oktober')), 'totaal_10'],
		[db.sequelize.fn('SUM', db.sequelize.col('november')), 'totaal_11'],
		[db.sequelize.fn('SUM', db.sequelize.col('december')), 'totaal_12']], 
   		group: ["Rekening.rekening"]
 	}).then(rekeningen => {
	  // Send all rekeningen to Client
	  res.send(rekeningen);
	});
};

exports.updateElektraMeterstanden = async (req, res) => {
	var request = require('request'); 
	var apikey = "ODE5NzlmMDBmZWNiMjZkMGU0NDcxZDI5MDJjMjRmMTdlMmI1NTE2M2FhYThhZmJlNTYwZDM3YTM1MzRhNTBkYw";
	var host = 'https://enelogic.com';
	var measuringpoint = "165704";
	
	MeterstandElektra.findOne({order: [ [ 'datetime', 'DESC' ]],}).then(laatstestand => {
		//res.write(laatstestand);
		var date = "2017-03-01";
		if(laatstestand !== null){
			date = laatstestand.datetime;
		}	
		var day = moment(date);
		var now = moment();
		now = now.add(-1, 'days');	
		var datapointUrl = host+'/api/measuringpoints/'+measuringpoint+'/datapoint/days/'+day.format("YYYY-MM-DD")+'/'+now.format('YYYY-MM-DD')+'?access_token='+apikey;
		console.log(datapointUrl);
		request(datapointUrl, async function(err, meterstanden){
			var meterstandendata = JSON.parse(meterstanden.body);
			console.log(meterstandendata[0].rate);
			var standinit = meterstandendata[0];
			var values = {datetime: standinit.date, ['kwh_' + standinit.rate]: standinit.quantity}
			console.log(values);
			var i = 0;
			for(const stand of meterstandendata){
				i++;
				if(i < 15){
				console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity);
				values = {datetime: stand.date, ['kwh_' + stand.rate]: stand.quantity}
				var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: stand.date} });
				if(gevondenmeterstand == null){
					gevondenmeterstand = await MeterstandElektra.create(values);
					console.log("Moet toegevoegd worden");
				}else{
					gevondenmeterstand = await gevondenmeterstand.update(values);
					console.log("Moet geupdate worden");
				}
				}
				
			}
			console.log("klaar");
		})
	});
	

}
