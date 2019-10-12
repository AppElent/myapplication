const path = require('path');
const db = require('./models');
import {basicAuthentication, adminAuthentication} from './middleware/authentication';

import {get, find, list, create, update, deleteRecord} from './modules/SequelizeREST';
import Cache from './modules/Cache';

module.exports = async function(app) {
	
	//Load all controllers
	const path = require('path');
	const fs = require('fs')
	var normalizedPath = path.join(__dirname, "./controllers");
	const controllers = {}
	fs.readdirSync(normalizedPath).forEach(function(file) {
	  const controllername = file.replace('.controller.js', '');
	  var stats = fs.statSync(normalizedPath + "/" + file);
	  if(stats.isFile()) controllers[controllername] = require("./controllers/" + file)
	  console.log('Controller ' + file + ' wordt geladen');
	});
	

	//Custom routes
	app.use('/api/custom', require('./controllers/custom.controller'))
	app.get('/api/test', basicAuthentication, (req, res) => { res.send({result: true, asd: false}); });

	//Rekeningen
	app.get('/api/rekeningen/:id', basicAuthentication, get(db.rekeningen));
	app.get('/api/rekeningen', basicAuthentication, list(db.rekeningen));
	app.get('/api/rekeningen/:column/:value', basicAuthentication, find(db.rekeningen));
	app.post('/api/rekeningen', basicAuthentication, create(db.rekeningen))
	app.put('/api/rekeningen/:id', basicAuthentication, update(db.rekeningen))
	app.delete('/api/rekeningen/:id', basicAuthentication, deleteRecord(db.rekeningen))
	
	//Meterstanden
	const meterstandCache = new Cache(300);
	app.get('/api/meterstanden/:id', basicAuthentication, get(db.meterstanden));
	app.get('/api/meterstanden', basicAuthentication, list(db.meterstanden, {cache: meterstandCache}));
	app.get('/api/meterstanden/:column/:value', basicAuthentication, find(db.meterstanden));
	app.post('/api/meterstanden', basicAuthentication, create(db.meterstanden))
	app.put('/api/meterstanden/:id', basicAuthentication, update(db.meterstanden))
	
	//Events
	app.get('/api/events/:id', basicAuthentication, get(db.events));
	app.get('/api/events', basicAuthentication, list(db.events));
	app.get('/api/events/:column/:value', basicAuthentication, find(db.events));
	app.post('/api/events', basicAuthentication, create(db.events))
	
	//OAuth routes
	app.use('/api/oauth', require('./controllers/oauth.controller'))
	
	//Meterstanden bijwerken en Enelogic routes
	app.use('/api/enelogic', require('./controllers/enelogic.controller'));
	
	//Bunq routes
	app.use('/api/bunq', require('./controllers/bunq.controller'));

	//SolarEdge
	app.use('/api/solaredge', require('./controllers/solaredge.controller'));

	//Tado
	app.use('/api/tado', require('./controllers/tado.controller'))
	
	//DarkSky
	app.use('/api/darksky', require('./controllers/darksky.controller'));

	//env=developer then make every model accessible
	if(process.env.NODE_ENV === 'development'){
		app.get('/api/development/:model', async (req, res) => {
			let conditions = {}
			if(req.query.user){
				conditions = { where: {userId: req.query.user} }
			}
			const data = await db[req.params.model].findAll(conditions);
			res.send(data);
		});
	}
	
	//rest van de routes zijn van react
	app.get('*', function (request, response){
	  response.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
	})	


}
