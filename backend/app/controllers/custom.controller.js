const db = require('../config/db.config.js');
const Rekening = db.rekeningen;
const PythonShell = require('python-shell')


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