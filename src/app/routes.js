const path = require('path');
//import fetch from 'node-fetch';
const db = require('./models');
import {basicAuthentication, adminAuthentication} from './middleware/authentication';

import {get, find, list, create, update, deleteRecord} from './modules/SequelizeREST';

module.exports = async function(app) {
	
	//PROXY routes
	/*
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
	*/
	
	
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
	
	//Loading the cache
	const Cache = require('./modules/Cache');
	
	/*
	//Loading OAUTH providers
	const OAuth = require('./classes/Oauth')
	
	
	const createOauthProviders = async () => {
		const enelogic = await db.oauthproviders.findOne({where: {id: 'enelogic'}});
		if (enelogic === null){
			db.oauthproviders.create({
				id: 'enelogic', 
				client_id: process.env.ENELOGIC_CLIENT_ID, 
				client_secret: process.env.ENELOGIC_CLIENT_SECRET,
				tokenHost: 'https://enelogic.com',
				tokenPath: '/oauth/v2/token',
				authorizePath: '/oauth/v2/auth',
				flow: 'authorization',
				redirect_url: process.env.APP_ROOT + '/enelogic/oauth',
				default_scope: 'account'
			})
		}
	}
	
	
	
	const loadOauthProviders = async () => {
		const allproviders = await db.oauthproviders.findAll();
		const results = {}
		allproviders.forEach(provider => {
			const oauthprovider = new OAuth(provider);
			oauthproviders[provider.id] = oauthprovider;
		})
	}
	const oauthproviders = {}
	loadOauthProviders();
	* */
	
	//loadOauthProviders().then(providers => {oauthproviders = providers; console.log(oauthproviders['enelogic'].formatUrl())});

	//Custom routes
	app.post('/api/redirectcall', basicAuthentication, controllers.custom.redirectCall);
	app.get('/api/test', basicAuthentication, (req, res) => {
		res.send({result: true, asd: false});
	});


	
	
	//Usersettings
	/*
	app.get('/api/usersettings/:id', basicAuthentication, controllers.basic.get(db.usersettings));
	app.get('/api/usersettings', basicAuthentication, controllers.basic.list(db.usersettings));
	app.get('/api/usersettings/:column/:value', basicAuthentication, controllers.basic.findOne(db.usersettings));
	app.post('/api/usersettings', basicAuthentication, controllers.basic.create(db.usersettings))
	app.put('/api/usersettings/:id', basicAuthentication, controllers.basic.update(db.usersettings))
	*/

	//Rekeningen
	app.get('/api/rekeningen/:id', basicAuthentication, get(db.rekeningen));
	app.get('/api/rekeningen', basicAuthentication, list(db.rekeningen));
	app.get('/api/rekeningen/:column/:value', basicAuthentication, find(db.rekeningen));
	app.post('/api/rekeningen', basicAuthentication, create(db.rekeningen))
	app.put('/api/rekeningen/:id', basicAuthentication, update(db.rekeningen))
	app.delete('/api/rekeningen/:id', basicAuthentication, deleteRecord(db.rekeningen))
	
	//Meterstanden
	const meterstandCache = new Cache(300);
	console.log(db.meterstanden);
	app.get('/api/meterstanden/:id', basicAuthentication, get(db.meterstanden));
	app.get('/api/meterstanden', basicAuthentication, list(db.meterstanden, {cache: meterstandCache}));
	app.get('/api/meterstanden/:column/:value', basicAuthentication, find(db.meterstanden));
	app.post('/api/meterstanden', basicAuthentication, create(db.meterstanden))
	app.put('/api/meterstanden/:id', basicAuthentication, update(db.meterstanden))
	
	//Users
	/*
	app.get('/api/users/:id', adminAuthentication, controllers.basic.get(db.users, {userColumnName: null}));
	app.get('/api/users', adminAuthentication, controllers.basic.list(db.users, {userColumnName: null}));
	app.get('/api/users/:column/:value', adminAuthentication, controllers.basic.findOne(db.users, {userColumnName: null}));
	app.post('/api/users', adminAuthentication, controllers.basic.create(db.users, {userColumnName: null}))
	app.put('/api/users/:id', adminAuthentication, controllers.basic.update(db.users, {userColumnName: null}))
	*/

	//API Settings
	/*
	app.get('/api/apisettings/:id', basicAuthentication, get(db.apisettings));
	app.get('/api/apisettings', basicAuthentication, list(db.apisettings));
	app.get('/api/apisettings/:column/:value', basicAuthentication, find(db.apisettings));
	app.post('/api/apisettings', basicAuthentication, create(db.apisettings))
	app.put('/api/apisettings/:id', basicAuthentication, update(db.apisettings))
	*/
	
	//Events
	app.get('/api/events/:id', basicAuthentication, get(db.events));
	app.get('/api/events', basicAuthentication, list(db.events));
	app.get('/api/events/:column/:value', basicAuthentication, find(db.events));
	app.post('/api/events', basicAuthentication, create(db.events))
	
	//OKTA routes
	//app.use('/api/okta/', require('./controllers/okta.controller'));
	//app.post('/api/okta/create', adminAuthentication, controllers.okta.createUser)
	//app.get('/api/okta/groups', basicAuthentication, controllers.okta.getGroups);
	
	//OAuth routes
	app.get('/api/oauth/formatUrl/:application', basicAuthentication, controllers.oauth.format());
	app.post('/api/oauth/exchange/:application', basicAuthentication, controllers.oauth.exchange());
	app.post('/api/oauth/refresh/:application', basicAuthentication, controllers.oauth.refresh());

	
	
	//Meterstanden bijwerken en Enelogic routes
	app.use('/api/enelogic', require('./controllers/enelogic.controller'));
	//app.get('/api/enelogic/data/dag/:start/:end', basicAuthentication, controllers.enelogic.getEnelogicData('day', oauthproviders));
	//app.get('/api/enelogic/data/kwartier/:start/:end', basicAuthentication, controllers.enelogic.getEnelogicData('quarter', oauthproviders));
	
	
	
	//Bunq routes
	app.use('/api/bunq', require('./controllers/bunq.controller'));
	/*
	
	app.post('/api/bunq/oauth/exchange', basicAuthentication, controllers.bunq.exchangeOAuthTokens);
	app.get('/api/bunq/accounts', basicAuthentication, controllers.bunq.getMonetaryAccounts);
	//app.get('/api/bunq/oauth/formatUrl', basicAuthentication, controllers.bunq.formatOAuthUrl);
	app.get('/api/bunq/accounts/:name', basicAuthentication, controllers.bunq.getMonetaryAccountByName);
	app.get('/api/bunq/accounts', basicAuthentication, controllers.bunq.getMonetaryAccounts);
	app.post('/api/bunq/payment', basicAuthentication, controllers.bunq.postPaymentInternal);
	app.get('/api/bunq/events', basicAuthentication, controllers.bunq.getEvents);
	app.post('/api/bunq/draftpayment', basicAuthentication, controllers.bunq.postDraftPayment);
	app.get('/api/bunq/cards', basicAuthentication, controllers.bunq.getCards)
	app.get('/api/bunq/sandbox', basicAuthentication, controllers.bunq.createSandboxAPIKey);
	app.get('/api/bunq/sandbox/request', basicAuthentication, controllers.bunq.requestSandboxMoney);
	app.get('/api/bunq/test', basicAuthentication, controllers.bunq.test);
	*/

	//SolarEdge
	//app.get('/api/solaredge/data/formatted/:start/:end', solaredge.getFormattedData);
	//app.get('/api/solaredge/inverterdata/:start/:end', basicAuthentication, controllers.solaredge.getInverterData);
	app.get('/api/solaredge/data/:timeUnit/:start/:end', basicAuthentication, controllers.solaredge.getData);
	app.get('/api/solaredge/sites', basicAuthentication, controllers.solaredge.getSiteData);
	app.get('/api/solaredge/equipment', basicAuthentication, controllers.solaredge.getEquipmentData);
	//app.get('/api/solaredge/updatedata/:start/:end', solaredge.updateSolarEdgeData);
	
	
	
	//Domoticz
	//app.get('/api/domoticz/update', controllers.domoticz.updateMeterstanden);
	//app.get('/api/domoticz/update/:force', controllers.domoticz.updateMeterstanden);





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

	
	// Create REST resource
	/*
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
	* */
	
	//rest van de routes zijn van react
	app.get('*', function (request, response){
	  response.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
	})	


}
