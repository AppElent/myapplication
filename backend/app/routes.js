var ForbiddenError = require('epilogue').Errors.ForbiddenError;
require('dotenv').config();

const path = require('path');
const OktaJwtVerifier = require('@okta/jwt-verifier');

var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();


module.exports = function(app, db, epilogue) {

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
	 */
	const requireAuthenticated = async (req, res, token = null, scoped = false, userparam = undefined) => {
	  const authenticated = await checkAuthenticated(req, res, token);
	  console.log('authenticated_result', authenticated.result, authenticated.reason, req.originalUrl);
	  if(authenticated.result === false) return authenticated;
	  if(authenticated.jwt === undefined) return authenticated;
	  
	  req.uid = authenticated.jwt.claims.uid;
	  req.jwt = authenticated.jwt
	  const checkuser = await checkUser(req.uid, userparam, scoped);
	  console.log('checkuser_result', checkuser.result, checkuser.reason, req.originalUrl);
	  return checkuser;
	  //return (checkuser === true ? true : 'User is niet goed');
	}

	
	async function epilogueAuthenticationRequired(req, res, context, token = null, scoped = false, userparam = undefined){
	  const authenticated = await requireAuthenticated(req, res, token, scoped, userparam);
	  if(authenticated.result === true){
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
			      next();
			  }else{
			      return res.status(401).send(authenticated.reason);
			  }
		  })
	  }
	}
	
	const basicAuthentication = authenticationRequired();
	
	redirectCall = async (req, res) => {
		
	  const body = req.body.body === null ? undefined : req.body.body;
	  const headers = req.body.headers === null ? undefined : req.body.headers;
	  const url = req.body.url;
	  
	  console.log('Making call to ' + url + ' with method ' + req.body.method);
	  const data = await fetch(url, {    
		    method: req.body.method ,
		    headers: headers,
		    body: JSON.stringify(body)
		  })
	  const jsondata = await data.json();

	  res.send( jsondata)
		
	}
	

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
	//const custom = require('./controllers/custom.controller.js');
	//app.get('/api/groupedrekeningen', authenticationRequired, custom.groupedOverview);
	app.post('/api/redirectcall', authenticationRequired, redirectCall);
	
	app.get('/api/testtest', authenticationRequired, function (req, res) {
	  res.send('GET request to the homepage')
	})
	
	//OKTA routes
	const okta = require('./controllers/okta.controller.js');
	app.post('/api/okta/create', okta.createUser)

	
	
	//Meterstanden bijwerken en Enelogic routes
	const enelogic = require('./controllers/enelogic.controller.js');
	app.post('/api/meterstanden/elektra/update', authenticationRequired, enelogic.updateElektraMeterstanden);
	app.get('/api/enelogic/oauth/formatUrl', enelogic.formatEnelogicAuthorizationUrl);
	app.get('/api/enelogic/oauth/exchangeToken', enelogic.exchangeEnelogicOauthToken);
	app.get('/api/enelogic/oauth/refreshToken', enelogic.refreshEnelogicOauthToken);
	app.get('/api/enelogic/updatedata/:type/:start/:end', enelogic.updateEnelogicData);
	app.get('/api/enelogic/data/dag/:start/:end', enelogic.getEnelogicDagData);
	app.get('/api/enelogic/data/kwartier/:datum', enelogic.getEnelogicKwartierData);
	
	
	
	
	
	//Bunq routes
	const bunq = require('./controllers/bunq.controller.js');
	app.get('/api/bunq/oauth/exchange', bunq.exchangeOAuthTokens);
	app.get('/api/bunq/oauth/formatUrl', basicAuthentication, bunq.formatOAuthUrl);
	app.get('/api/bunq/accounts/:name', basicAuthentication, bunq.getMonetaryAccountByName);
	app.get('/api/bunq/accounts', authenticationRequired(null, 3, undefined), bunq.getMonetaryAccounts);
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
	  return await epilogueAuthenticationRequired(req, res, context);
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
