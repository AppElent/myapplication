var ForbiddenError = require('epilogue').Errors.ForbiddenError;
const path = require('path');
const OktaJwtVerifier = require('@okta/jwt-verifier');


module.exports = function(app, db, epilogue) {

	const oktaJwtVerifier = new OktaJwtVerifier({
	  issuer: 'https://dev-810647.okta.com/oauth2/default',
	  clientId: '0oabepfc2Yo0a3Q0H356',
	  assertClaims: {
	    aud: 'api://default',
	  },
	});

	/**
	 * A simple middleware that asserts valid access tokens and sends 401 responses
	 * if the token is not present or fails validation.  If the token is valid its
	 * contents are attached to req.jwt
	 */
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



	//Basic routes
	/*
	app.get('/home', (req, res) => {
		res.send('<h1>Welcome!!</div><a href="/login">Login</a>');
	});
	app.get('/logout', (req, res) => {
	  req.logout();
	  res.redirect('/home');
	});
	*/

	//Custom routes
	const custom = require('./controllers/custom.controller.js');
	    
	// Retrieve all Rekeningen grouped
	app.get('/api/groupedrekeningen', authenticationRequired, custom.groupedOverview);
	
	// Create a new bunqRun
    	//app.post('/api/bunq/run', custom.run);
	
	//Meterstanden bijwerken
	app.get('/api/meterstanden/elektra/update', custom.updateElektraMeterstanden);
	



	// Create REST resource
	var customerResource = epilogue.resource({
	  	model: db.customers,
	  	endpoints: ['/api/customers', '/api/customers/:id']
	});

	// Create REST resource
	var configResource = epilogue.resource({
	  model: db.config,
	  endpoints: ['/api/config', '/api/config/:item']
	});

	// Create REST resource
	var eventResource = epilogue.resource({
	  model: db.events,
	  endpoints: ['/api/events', '/api/events/:id']
	});
	eventResource.delete.auth(function(req, res, context) {
    		throw new ForbiddenError("can't delete an event");
	});
	//eventResource.list.use(authenticationRequired);

	// Create REST resource
	var rekeningResource = epilogue.resource({
	  model: db.rekeningen,
	  endpoints: ['/api/rekeningen', '/api/rekeningen/:id']
	});
	rekeningResource.use(authenticationRequired);

	// Create REST resource
	var meterstandWarmteResource = epilogue.resource({
	  model: db.meterstandenwarmte,
	  endpoints: ['/api/meterstanden/warmte', '/api/meterstanden/warmte/:id']
	});

	// Create REST resource
	var meterstandElektraResource = epilogue.resource({
	  model: db.meterstandenelektra,
	  endpoints: ['/api/meterstanden/elektra', '/api/meterstanden/elektra/:id']
	});

	//rest van de routes zijn van react
	app.get('*', function (request, response){
	  response.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'))
	})	


}
