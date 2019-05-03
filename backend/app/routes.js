var ForbiddenError = require('epilogue').Errors.ForbiddenError;
require('dotenv').config();

const path = require('path');
//const OktaJwtVerifier = require('@okta/jwt-verifier');

var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

const fetch = require("node-fetch");

const auth = require("./middleware/authentication")


module.exports = function(app, db, epilogue) {
	
	/*
	const oktaJwtVerifier = new OktaJwtVerifier({
	  issuer: 'https://dev-810647.okta.com/oauth2/default',
	  clientId: process.env.OKTA_CLIENT_ID,
	  assertClaims: {
	    aud: 'api://default',
	  },
	});
	

	const checkAuthenticated = async (req, res, token = null) => {
		//Checken of er een custom token is
		//const token = "homebridge-authenticated"
		const authHeader = req.headers.authorization || '';
		//console.log(req.headers);
		const apimatch = authHeader.match(/Apitoken (.+)/);
		const remoteIP = req.socket.remoteAddress;
		if(!apimatch && token !== null) return {result: false, reason: 'No API token given'}
		if (apimatch && token) {
			const accessToken = apimatch[1];
			console.log(accessToken, token, remoteIP, remoteIP.endsWith('192.168.178.1'));
			const localaddress = (remoteIP.endsWith('192.168.178.1') ? true : false)
			if(localaddress === false) return {result: false, reason: 'No local address'}
			if(accessToken !== token) return {result: false, reason: 'Token doesnt match'}
			return {result: true, jwt: false}
			//return res.status(401).end();
		}
		
		
		
		const bearermatch = authHeader.match(/Bearer (.+)/);

		if (!bearermatch) return {result: false, reason: 'Bearer does not match'}
		
		const accessToken = bearermatch[1];
		try{
			const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken);
			return {result: true, jwt: jwt}
		}catch(error){
			console.log(error);
			return {result: false, reason: 'Accesstoken incorrect'}
		}
		
		
	}
	
	const checkUser = async (authid, id, scoped) => {
		if(id !== undefined){
			if(id !== authid){
				return {result: false, reason: 'Request for wrong user'}
			}
		}else{
			if(scoped === true){
				return {result: false, reason: 'Scoped=true and no user id given'}
			}else if (scoped === false){
				return {result: true, reason: 'Scoped=false, no user id given'}
			}
		}

		const user = await db.users.findByPk(authid);
		if(user === null){
			return {result: false, reason: 'User not found'}
		}
		
		if(Number.isInteger(scoped)){
			if(user.access_level < scoped){
				return {result: false, reason: 'Accesslevel not high enough'}
			}	
		}
		
		return {result: true, reason: ''}

	}
	
	//checkUser('abc').then(data => console.log(data))
	//checkUser('00uaz3xmdoobfWWnY356').then(data => console.log(data))

	/**
	 * A simple middleware that asserts valid access tokens and sends 401 responses
	 * if the token is not present or fails validation.  If the token is valid its
	 * contents are attached to req.jwt
	 
	const requireAuthenticated = async (req, res, token = null, scoped = false, userparam = undefined) => {
	  const authenticated = await checkAuthenticated(req, res, token);
	  console.log('authenticated_result', authenticated.result, authenticated.reason, req.originalUrl);
	  if(authenticated.result === false) return authenticated;
	  if(authenticated.jwt === undefined) return authenticated;
	  
	  req.uid = authenticated.jwt.claims.uid;
	  req.jwt = authenticated.jwt
	  const checkuser = await checkUser(req.uid, userparam, scoped);
	  console.log('checkuser_result', checkuser.result, checkuser.reason, req.originalUrl);
	  checkuser.jwt = authenticated.jwt;
	  return checkuser;
	  //return (checkuser === true ? true : 'User is niet goed');
	}

	
	async function epilogueAuthenticationRequired(req, res, context, token = null, scoped = false, userparam = undefined){
	  const authenticated = await requireAuthenticated(req, res, token, scoped, userparam);
	  if(authenticated.result === true){
		  req.jwt = authenticated.jwt;
	      return context.continue;
	  }
	  console.log("Error = " + authenticated.reason);
	  return context.stop;
	}
	

	const authenticationRequired = (token = null, scoped = false, userparam = undefined) => {
	  return function(req, res, next){
		  requireAuthenticated(req, res, token, scoped, userparam)
		  .then(authenticated => {
			  if(authenticated.result === true){
			      req.jwt = authenticated.jwt;
			      next();
			  }else{
			      return res.status(401).send(authenticated.reason);
			  }
		  })
	  }
	}
	*/
	
	const basicAuthentication = auth.authenticationRequired();
	const adminAuthentication = auth.authenticationRequired(null, 'Admins');
	
	/*
	redirectCall = async (req, res) => {
		
	  const body = req.body.body === null ? undefined : req.body.body;
	  const headers = req.body.headers === null ? undefined : req.body.headers;
	  const url = req.body.url;
	  
	  console.log('Making call to ' + url + ' with method ' + req.body.method);
	  const data = await fetch(url, {    
		    method: req.body.method ,
		    headers: headers,
		    body: JSON.stringify(body)
		  }).catch(err => res.status(500).send(err))
	  const jsondata = await data.json().catch(err => res.status(500).send(err));

	  res.send( jsondata)
		
	}
	* */
	

	//PROXY routes
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

	//Custom routes
	const custom = require('./controllers/custom.controller.js');
	app.post('/api/redirectcall', basicAuthentication, custom.redirectCall);
	
	//Basic routes
	const basic = require('./controllers/basic.controller.js');

	
	//Usersettings
	app.get('/api/usersettings/:id', basicAuthentication, basic.get(db.usersettings));
	app.get('/api/usersettings', basicAuthentication, basic.list(db.usersettings));
	app.get('/api/usersettings/:column/:value', basicAuthentication, basic.findOne(db.usersettings));
	app.post('/api/usersettings', basicAuthentication, basic.create(db.usersettings))
	app.put('/api/usersettings/:id', basicAuthentication, basic.update(db.usersettings))
	
	//Rekeningen
	app.get('/api/rekeningen/:id', basicAuthentication, basic.get(db.rekeningen));
	app.get('/api/rekeningen', basicAuthentication, basic.list(db.rekeningen));
	app.get('/api/rekeningen/:column/:value', basicAuthentication, basic.findOne(db.rekeningen));
	app.post('/api/rekeningen', basicAuthentication, basic.create(db.rekeningen))
	app.put('/api/rekeningen/:id', basicAuthentication, basic.update(db.rekeningen))
	
	//Meterstanden
	app.get('/api/meterstanden/:id', basicAuthentication, basic.get(db.meterstanden));
	app.get('/api/meterstanden', basicAuthentication, basic.list(db.meterstanden));
	app.get('/api/meterstanden/:column/:value', basicAuthentication, basic.findOne(db.meterstanden));
	app.post('/api/meterstanden', basicAuthentication, basic.create(db.meterstanden))
	app.put('/api/meterstanden/:id', basicAuthentication, basic.update(db.meterstanden))
	
	//Users
	app.get('/api/users/:id', adminAuthentication, basic.get(db.users, 'id', null));
	app.get('/api/users', adminAuthentication, basic.list(db.users, null));
	app.get('/api/users/:column/:value', adminAuthentication, basic.findOne(db.users, null));
	app.post('/api/users', adminAuthentication, basic.create(db.users, null))
	app.put('/api/users/:id', adminAuthentication, basic.update(db.users, 'id', null))
	
	//Events
	app.get('/api/events/:id', basicAuthentication, basic.get(db.events));
	app.get('/api/events', basicAuthentication, basic.list(db.events));
	app.get('/api/events/:column/:value', basicAuthentication, basic.findOne(db.events));
	app.post('/api/events', basicAuthentication, basic.create(db.events))
	app.put('/api/events/:id', basicAuthentication, basic.update(db.events))
	
	//OKTA routes
	const okta = require('./controllers/okta.controller.js');
	app.post('/api/okta/create', adminAuthentication, okta.createUser)
	app.get('/api/okta/groups', basicAuthentication, okta.getGroups);
	
	//OAuth routes
	const oauth = require('./controllers/oauth.controller.js');
	app.get('/api/oauth/formatUrl/:application', oauth.format);
	app.post('/api/oauth/exchange/:application', oauth.exchange);
	app.post('/api/oauth/refresh/:application', oauth.refresh);

	
	
	//Meterstanden bijwerken en Enelogic routes
	const enelogic = require('./controllers/enelogic.controller.js');
	//app.post('/api/meterstanden/elektra/update', auth.authenticationRequired, enelogic.updateElektraMeterstanden);
	//app.get('/api/enelogic/oauth/formatUrl', enelogic.format);
	//app.post('/api/enelogic/oauth/exchange', enelogic.exchange);
	//app.post('/api/enelogic/oauth/refresh', enelogic.refresh);
	//app.get('/api/enelogic/updatedata/:type/:start/:end', enelogic.updateEnelogicData);
	app.get('/api/enelogic/data/dag/:start/:end', enelogic.getEnelogicDagData);
	app.get('/api/enelogic/data/kwartier/:datum', enelogic.getEnelogicKwartierData);
	
	
	
	
	
	//Bunq routes
	const bunq = require('./controllers/bunq.controller.js');
	app.get('/api/bunq/oauth/exchange', bunq.exchangeOAuthTokens);
	app.get('/api/bunq/oauth/formatUrl', basicAuthentication, bunq.formatOAuthUrl);
	app.get('/api/bunq/accounts/:name', basicAuthentication, bunq.getMonetaryAccountByName);
	app.get('/api/bunq/accounts', basicAuthentication, bunq.getMonetaryAccounts);
	app.post('/api/bunq/payment', basicAuthentication, bunq.postPaymentInternal);
	app.get('/api/bunq/test', basicAuthentication, bunq.test);



	//SolarEdge
	const solaredge = require('./controllers/solaredge.controller.js');
	//app.get('/api/solaredge/data/formatted/:start/:end', solaredge.getFormattedData);
	app.get('/api/solaredge/inverterdata/:start/:end', solaredge.getInverterData);
	app.get('/api/solaredge/data/:timeUnit/:start/:end', solaredge.getData);
	app.get('/api/solaredge/sites', solaredge.getSiteData);
	app.get('/api/solaredge/equipment', solaredge.getEquipmentData);
	//app.get('/api/solaredge/updatedata/:start/:end', solaredge.updateSolarEdgeData);
	
	
	
	//Domoticz
	const domoticz = require('./controllers/domoticz.controller.js');
	app.get('/api/domoticz/update', domoticz.updateMeterstanden);
	app.get('/api/domoticz/update/:force', domoticz.updateMeterstanden);





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

	/*
	// Create REST resource
	var customerResource = epilogue.resource({
	  	model: db.customers,
	  	endpoints: ['/api/customers', '/api/customers/:id']
	}).all.auth(async function (req, res, context) {
	  return await epilogueAuthenticationRequired(req, res, context);
	});

	// Create REST resource
	var configResource = epilogue.resource({
	  model: db.config,
	  endpoints: ['/api/config', '/api/config/:item']
	}).all.auth(async function (req, res, context) {
	  return await epilogueAuthenticationRequired(req, res, context);
	});

	// Create REST resource
	var eventResource = epilogue.resource({
	  model: db.events,
	  endpoints: ['/api/events', '/api/events/:id'],
	  sort: {default: '-datetime'},
	  pagination: false,
	});
	eventResource.all.auth(async function (req, res, context) {
	  return await epilogueAuthenticationRequired(req, res, context);
	});
	eventResource.create.auth(async function (req, res, context) {
	  return await epilogueAuthenticationRequired(req, res, context, 'homebridge-authenticated');
	});
	eventResource.list.fetch.before(function(req, res, context) {
		req.query.user = req.jwt.claims.uid
		return context.continue;
	})
	//eventResource.all.auth(async function (req, res, context) {
	  //return await epilogueCustomToken(req, res, 'homebridge-authenticated', context);
	//});
	eventResource.delete.auth(function(req, res, context) {
    		throw new ForbiddenError("can't delete an event");
	});
	
	
	// Create REST resource
	var rekeningResource = epilogue.resource({
	  model: db.rekeningen,
	  endpoints: ['/api/rekeningen', '/api/rekeningen/:id']
	}).all.auth(async function (req, res, context) {
	  return context.continue;//await epilogueAuthenticationRequired(req, res, context);
	});	
	

	// Create REST resource
	var meterstandenResource = epilogue.resource({
	  model: db.meterstanden,
	  endpoints: ['/api/meterstanden', '/api/meterstanden/:datetime'],
	  //sort: {default: '-datetime'},
	  pagination: false
	}).all.auth(async function (req, res, context) {
	  return context.continue;//await epilogueAuthenticationRequired(req, res, context);
	});
	
	// Create REST resource
	var userResource = epilogue.resource({
	  model: db.users,
	  endpoints: ['/api/users', '/api/users/:id'],
	  //sort: {default: '-datetime'},
	  pagination: false
	}).all.auth(async function (req, res, context) {
	  return context.continue;//return await epilogueAuthenticationRequired(req, res, context);
	});
	* */
	
	/*
	//Usersettings
	var userSettingsResource = epilogue.resource({
	  model: db.usersettings,
	  endpoints: ['/api/usersettings', '/api/usersettings/:id'],
	  pagination: false
	})
	userSettingsResource.all.auth(async (req, res, context) => { return await epilogueAuthenticationRequired(req, res, context);  })
	userSettingsResource.list.fetch.before((req, res, context) => { req.query.user = req.jwt.claims.uid; return context.continue;  })
	userSettingsResource.create.write.before((req, res, context) => { console.log(req.body);req.body.user = req.jwt.claims.uid; return context.continue;  })
	userSettingsResource.update.write.before((req, res, context) => { console.log(req.body);req.body.user = req.jwt.claims.uid; console.log(req.body, context); return context.continue;  })
	*/
	
	
	
	
	
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
