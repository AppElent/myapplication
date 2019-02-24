var ForbiddenError = require('epilogue').Errors.ForbiddenError;
const path = require('path');


module.exports = function(app, db, epilogue, oidc) {

	//Basic routes
	app.get('/home', (req, res) => {
		res.send('<h1>Welcome!!</div><a href="/login">Login</a>');
	});
	app.get('/logout', (req, res) => {
	  req.logout();
	  res.redirect('/home');
	});
	
	app.get('/', (req, res) => {
	  res.redirect('/home');
	});
	app.get('/admin', oidc.ensureAuthenticated(), (req, res) =>{
	  res.send('Admin page');
	});
	
	//Custom routes
	const custom = require('./controllers/custom.controller.js');
	    
	// Retrieve all Rekeningen grouped
	app.get('/api/groupedrekeningen', custom.groupedOverview);
	
	// Create a new bunqRun
    	app.post('/api/bunq/run', custom.run);
	
	//Meterstanden bijwerken
	app.get('/api/meterstanden/elektra/update', custom.updateElektraMeterstanden);
	



	// Create REST resource
	var customerResource = epilogue.resource({
	  	model: db.customers,
	  	endpoints: ['/api/customers', '/api/customers/:id']
	});

	customerResource.all.auth(function (req, res, context) {
	    return new Promise(function (resolve, reject) {
	        if (!req.isAuthenticated()) {
	            res.status(401).send({ message: "Unauthorized" });
	            resolve(context.stop);
	        } else {
	            resolve(context.continue);
	        }
	    })
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
	}).delete.auth(function(req, res, context) {
    		throw new ForbiddenError("can't delete an event");
	});

	// Create REST resource
	var rekeningResource = epilogue.resource({
	  model: db.rekeningen,
	  endpoints: ['/api/rekeningen', '/api/rekeningen/:id']
	});

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
