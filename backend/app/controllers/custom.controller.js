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

exports.updateElektraMeterstanden = (req, res) => {
	var request = require('request'); 
	var apikey = "NTY0MGI1NmRjZjg0YjU0MGY2ZTIwYTdjMmNmZmI0MjU2MDZhYjllNDUzZjY5MTkwMGJjOTBlZWZjYmU1ZmZjMA";
	var host = 'https://enelogic.com';
	var url = host+'/api/measuringpoints?access_token='+apikey;
	request(url, function(err, body){
	  var measuringpoint = JSON.parse(body.body)[0];
	  
	  MeterstandElektra.findOne({
		where: {
			//key: key,
		},
		order: [ [ 'datetime', 'DESC' ]],
	  }).then(latest => {
		  var date = "2017-03-01";
		  if(latest !== null){
			date = latest.datetime;
		  }
		  var day = moment(date);
		  var now = moment();
		  now = now.add(-1, 'days');
		  /*
		  while(true){
			var datapointUrl = host+'/api/measuringpoints/'+measuringpoint.id+'/datapoints/'+day.format("YYYY-MM-DD")+'/'+day.add(1, 'days').format('YYYY-MM-DD')+'?access_token='+apikey;
			console.log(datapointUrl);
			if(day.format('YYYY-MM-DD') == now.format('YYYY-MM-DD')){
				break;
			}
			request(url, function(err, body){
				res.json(body);
			});	
		  }
		  */
		  var datapointUrl = host+'/api/measuringpoints/'+measuringpoint.id+'/datapoint/days/'+day.format("YYYY-MM-DD")+'/'+now.format('YYYY-MM-DD')+'?access_token='+apikey;
		  console.log(datapointUrl);
		  request(datapointUrl, function(err, meterstanden){
			console.log(meterstanden);
			res.json(meterstanden);
			var meterstandendata = JSON.parse(meterstanden.body);
			console.log('meterstandendata:'+meterstandendata);
			for(var stand in meterstandendata){
				var datetime = moment(stand.date);
				MeterstandElektra.findOne({ where: {datetime: datetime} })
					.then(function(obj) {
						var values = '';
						
						console.log('datetime:'+datetime);
						console.log('stand.rate:'+stand.rate);
						switch(stand.rate) {
						  
						  case 181:
							values = {datetime: datetime, verbruik_laag: stand.quantity}
							break;
						  case 182:
							values = {datetime: datetime, verbruik_hoog: stand.quantity}
							break;
						  case 281:
							values = {datetime: datetime, teruglevering_laag: stand.quantity}
							break;
						  case 282:
							values = {datetime: datetime, teruglevering_hoog: stand.quantity}
							break;
						  default:
							// code block
						}
						console.log(values);						
						if(obj) { // update
							//obj.update(values);
						}
						else { // insert
							//MeterstandElektra.create(values);
						}
					});
			  }
			});
			//res.json(meterstanden);
		});	

	  
	  //res.json(data);
	  //res.json(body); //res is the response object, and it passes info back to client side
	});	

}
