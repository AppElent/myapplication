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

	/**
	 * A simple middleware that asserts valid access tokens and sends 401 responses
	 * if the token is not present or fails validation.  If the token is valid its
	 * contents are attached to req.jwt
	 */

	
	async function epilogueAuthenticationRequired(req, res, context){
	  const authHeader = req.headers.authorization || '';
	  const match = authHeader.match(/Bearer (.+)/);

	  if (!match) {
	    return res.status(401).end();
	  }

	  const accessToken = match[1];

	  return oktaJwtVerifier.verifyAccessToken(accessToken)
	    .then((jwt) => {
	      req.jwt = jwt;
	      return context.continue;
	    })
	    .catch((err) => {
	      return context.stop;
	    });
	}
	async function epilogueCustomToken(req, res, token, context){
	  const authHeader = req.headers.authorization || '';
	  //console.log(req.headers);
	  const match = authHeader.match(/Apitoken (.+)/);

	  if (!match) {
	    return await epilogueAuthenticationRequired(req, res, context);
	    //return res.status(401).end();
	  }

	  const accessToken = match[1];
	  console.log(accessToken, token);
	  return (accessToken === token ? context.continue : context.stop);
	}
	
	function authenticationRequired(req, res, next) {
	  const authHeader = req.headers.authorization || '';
	  const match = authHeader.match(/Bearer (.+)/);

	  if (!match) {
	    return res.status(401).end();
	  }

	  const accessToken = match[1];

	  return oktaJwtVerifier.verifyAccessToken(accessToken)
	    .then((jwt) => {
	      req.jwt = jwt;
	      next();
	    })
	    .catch((err) => {
	      res.status(401).send(err.message);
	    });
	}


	//PROXY routes
	//app.all("/domoticz/*", function(req, res) {
	  //  console.log('redirecting to Domoticz');
	    //apiProxy.web(req, res, {target: 'http://localhost:8090'});
	//});
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
	app.get('/api/groupedrekeningen', authenticationRequired, custom.groupedOverview);
	
	
	
	
	
	//Meterstanden bijwerken en Enelogic routes
	const enelogic = require('./controllers/enelogic.controller.js');
	app.post('/api/meterstanden/elektra/update', authenticationRequired, enelogic.updateElektraMeterstanden);
	app.get('/api/enelogic/oauth/formatUrl', enelogic.formatEnelogicAuthorizationUrl);
	app.get('/api/enelogic/oauth/exchangeToken', enelogic.exchangeEnelogicOauthToken);
	app.get('/api/enelogic/oauth/refreshToken', enelogic.refreshEnelogicOauthToken);
	
	
	
	
	
	
	
	//Bunq routes
	const bunq = require('./controllers/bunq.controller.js');
	app.get('/api/bunq/oauth/exchange', bunq.exchangeOAuthTokens);
	app.get('/api/bunq/oauth/formatUrl', authenticationRequired, bunq.formatOAuthUrl);
	app.get('/api/bunq/accounts/:name', authenticationRequired, bunq.getMonetaryAccountByName);
	app.get('/api/bunq/accounts', authenticationRequired, bunq.getMonetaryAccounts);
	app.post('/api/bunq/payment', authenticationRequired, bunq.postPaymentInternal);
	app.get('/api/bunq/test', authenticationRequired, bunq.test);



	//SolarEdge
	const solaredge = require('./controllers/solaredge.controller.js');
	app.get('/api/solaredge/data/:start/:end', solaredge.getData);
	app.get('/api/solaredge/sites', solaredge.getSiteData);
	app.get('/api/solaredge/equipment', solaredge.getEquipmentData);
	app.get('/api/solaredge/updatedata/:start/:end', solaredge.updateSolarEdgeData);
	
	
	
	//Domoticz
	const domoticz = require('./controllers/domoticz.controller.js');
	app.get('/api/domoticz/update', domoticz.updateMeterstanden);





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
	  return await epilogueCustomToken(req, res, 'homebridge-authenticated', context);
	});
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
	  sort: {default: '-datetime'},
	  pagination: false
	}).all.auth(async function (req, res, context) {
	  return await epilogueAuthenticationRequired(req, res, context);
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
