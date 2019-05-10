const path = require('path');
const fetch = require("node-fetch");


module.exports = function(app, db, epilogue) {
	
	const auth = require("./middleware/authentication")
	const basicAuthentication = auth.authenticationRequired();
	const adminAuthentication = auth.authenticationRequired({group: 'Admins'});
	

	//PROXY routes
	var httpProxy = require('http-proxy');
	var apiProxy = httpProxy.createProxyServer();
	app.all('/domoticz(/*)?', (req, res) => {
	    const urlRegex =  /^\/domoticz/gm;
	    req.url = req.url.replace(urlRegex, '');
	    apiProxy.web(req, res, {
		target: 'http://localhost:8090',
		prependPath: false
	    });
	});
	app.all('/homebridge(/*)?', (req, res) => {
	    const urlRegex =  /^\/homebridge/gm;
	    req.url = req.url.replace(urlRegex, '');
	    apiProxy.web(req, res, {
		target: 'https://localhost:8080',
		prependPath: false
	    });
	});
	
	
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
	app.post('/api/redirectcall', basicAuthentication, controllers.custom.redirectCall);
	
	
	//Usersettings
	app.get('/api/usersettings/:id', basicAuthentication, controllers.basic.get(db.usersettings));
	app.get('/api/usersettings', basicAuthentication, controllers.basic.list(db.usersettings));
	app.get('/api/usersettings/:column/:value', basicAuthentication, controllers.basic.findOne(db.usersettings));
	app.post('/api/usersettings', basicAuthentication, controllers.basic.create(db.usersettings))
	app.put('/api/usersettings/:id', basicAuthentication, controllers.basic.update(db.usersettings))
	
	//Rekeningen
	app.get('/api/rekeningen/:id', basicAuthentication, controllers.basic.get(db.rekeningen));
	app.get('/api/rekeningen', basicAuthentication, controllers.basic.list(db.rekeningen));
	app.get('/api/rekeningen/:column/:value', basicAuthentication, controllers.basic.findOne(db.rekeningen));
	app.post('/api/rekeningen', basicAuthentication, controllers.basic.create(db.rekeningen))
	app.put('/api/rekeningen/:id', basicAuthentication, controllers.basic.update(db.rekeningen))
	app.delete('/api/rekeningen/:id', basicAuthentication, controllers.basic.delete(db.rekeningen))
	
	//Meterstanden
	app.get('/api/meterstanden/:id', basicAuthentication, controllers.basic.get(db.meterstanden));
	app.get('/api/meterstanden', basicAuthentication, controllers.basic.list(db.meterstanden));
	app.get('/api/meterstanden/:column/:value', basicAuthentication, controllers.basic.findOne(db.meterstanden));
	app.post('/api/meterstanden', basicAuthentication, controllers.basic.create(db.meterstanden))
	app.put('/api/meterstanden/:id', basicAuthentication, controllers.basic.update(db.meterstanden))
	
	//Users
	app.get('/api/users/:id', adminAuthentication, controllers.basic.get(db.users, {userColumnName: null}));
	app.get('/api/users', adminAuthentication, controllers.basic.list(db.users, {userColumnName: null}));
	app.get('/api/users/:column/:value', adminAuthentication, controllers.basic.findOne(db.users, {userColumnName: null}));
	app.post('/api/users', adminAuthentication, controllers.basic.create(db.users, {userColumnName: null}))
	app.put('/api/users/:id', adminAuthentication, controllers.basic.update(db.users, {userColumnName: null}))
	
	//API Settings
	app.get('/api/apisettings/:id', basicAuthentication, controllers.basic.get(db.apisettings));
	app.get('/api/apisettings', basicAuthentication, controllers.basic.list(db.apisettings));
	app.get('/api/apisettings/:column/:value', basicAuthentication, controllers.basic.findOne(db.apisettings));
	app.post('/api/apisettings', basicAuthentication, controllers.basic.create(db.apisettings))
	app.put('/api/apisettings/:id', basicAuthentication, controllers.basic.update(db.apisettings))
	
	//Events
	app.get('/api/events/:id', basicAuthentication, controllers.basic.get(db.events));
	app.get('/api/events', basicAuthentication, controllers.basic.list(db.events));
	app.get('/api/events/:column/:value', basicAuthentication, controllers.basic.findOne(db.events));
	app.post('/api/events', basicAuthentication, controllers.basic.create(db.events))
	app.put('/api/events/:id', basicAuthentication, controllers.basic.update(db.events))
	
	//OKTA routes
	app.post('/api/okta/create', adminAuthentication, controllers.okta.createUser)
	app.get('/api/okta/groups', basicAuthentication, controllers.okta.getGroups);
	
	//OAuth routes
	app.get('/api/oauth/formatUrl/:application', basicAuthentication, controllers.oauth.format);
	app.post('/api/oauth/exchange/:application', basicAuthentication, controllers.oauth.exchange);
	app.post('/api/oauth/refresh/:application', basicAuthentication, controllers.oauth.refresh);

	
	
	//Meterstanden bijwerken en Enelogic routes
	//app.post('/api/meterstanden/elektra/update', auth.authenticationRequired, enelogic.updateElektraMeterstanden);
	//app.get('/api/enelogic/oauth/formatUrl', enelogic.format);
	//app.post('/api/enelogic/oauth/exchange', enelogic.exchange);
	//app.post('/api/enelogic/oauth/refresh', enelogic.refresh);
	//app.get('/api/enelogic/updatedata/:type/:start/:end', enelogic.updateEnelogicData);
	app.get('/api/enelogic/data/dag/:start/:end', controllers.enelogic.getEnelogicDagData);
	app.get('/api/enelogic/data/kwartier/:datum', controllers.enelogic.getEnelogicKwartierData);
	
	
	
	
	
	//Bunq routes
	app.get('/api/bunq/oauth/exchange', controllers.bunq.exchangeOAuthTokens);
	app.get('/api/bunq/oauth/formatUrl', basicAuthentication, controllers.bunq.formatOAuthUrl);
	app.get('/api/bunq/accounts/:name', basicAuthentication, controllers.bunq.getMonetaryAccountByName);
	app.get('/api/bunq/accounts', basicAuthentication, controllers.bunq.getMonetaryAccounts);
	app.post('/api/bunq/payment', basicAuthentication, controllers.bunq.postPaymentInternal);
	app.get('/api/bunq/test', basicAuthentication, controllers.bunq.test);



	//SolarEdge
	//app.get('/api/solaredge/data/formatted/:start/:end', solaredge.getFormattedData);
	app.get('/api/solaredge/inverterdata/:start/:end', controllers.solaredge.getInverterData);
	app.get('/api/solaredge/data/:timeUnit/:start/:end', controllers.solaredge.getData);
	app.get('/api/solaredge/sites', controllers.solaredge.getSiteData);
	app.get('/api/solaredge/equipment', controllers.solaredge.getEquipmentData);
	//app.get('/api/solaredge/updatedata/:start/:end', solaredge.updateSolarEdgeData);
	
	
	
	//Domoticz
	app.get('/api/domoticz/update', controllers.domoticz.updateMeterstanden);
	app.get('/api/domoticz/update/:force', controllers.domoticz.updateMeterstanden);





	//Tado
	const tado = require('./controllers/tado.controller.js');
	app.get('/api/tado/test', tado.test);
	app.get('/api/tado/homes', tado.homes);
	app.get('/api/tado/zones', tado.zones);
	app.get('/api/tado/report/:zone/:date', tado.report);
	app.get('/api/tado/state/:zone/', tado.state);
	
	
	//DarkSky
	const darksky = require('./controllers/darksky.controller.js');
	app.get('/api/darksky/current', darksky.getCurrentData);
	app.get('/api/darksky/:date', darksky.getDateData);

	
	// Create REST resource
	epilogue.resource({
	  model: db.multimeter,
	  endpoints: ['/api/domoticz/multimeter', '/api/domoticz/multimeter/:DeviceRowID'],
	  sort: {default: 'Date'},
	  pagination: false
	});
	
	epilogue.resource({
	  model: db.multimeter_calendar,
	  endpoints: ['/api/domoticz/multimeter_calendar', '/api/domoticz/multimeter_calendar/:DeviceRowID'],
	  sort: {default: 'Date'},
	  pagination: false
	});
	
	epilogue.resource({
	  model: db.meter,
	  endpoints: ['/api/domoticz/meter', '/api/domoticz/meter/:DeviceRowID'],
	  sort: {default: 'Date'},
	  pagination: false
	});
	
	epilogue.resource({
	  model: db.meter_calendar,
	  endpoints: ['/api/domoticz/meter_calendar', '/api/domoticz/meter_calendar/:DeviceRowID'],
	  sort: {default: 'Date'},
	  pagination: false
	});
	
	//rest van de routes zijn van react
	app.get('*', function (request, response){
	  response.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'))
	})	


}
