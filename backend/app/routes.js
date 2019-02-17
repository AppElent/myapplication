var ForbiddenError = require('epilogue').Errors.ForbiddenError;


module.exports = function(app, db, epilogue) {

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
	}).delete.auth(function(req, res, context) {
    		throw new ForbiddenError("can't delete an event");
	});

	// Create REST resource
	var rekeningResource = epilogue.resource({
	  model: db.rekeningen,
	  endpoints: ['/api/rekeningen', '/api/rekeningen/:id']
	});

/*
// Alle customer Routes
    const customers = require('./controllers/customer.controller.js');
 
    // Create a new Customer
    app.post('/api/customers', customers.create);
 
    // Retrieve all Customer
    app.get('/api/customers', customers.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/customers/:customerId', customers.findById);
 
    // Update a Customer with Id
    app.put('/api/customers/:customerId', customers.update);
 
    // Delete a Customer with Id
    app.delete('/api/customers/:customerId', customers.delete);

    // Alle event Routes
    const events = require('./controllers/event.controller.js');
 
    // Create a new Event
    app.post('/api/events', events.create);
 
    // Retrieve all Event
    app.get('/api/events', events.findAll);
 
    // Retrieve a single Event by Id
    app.get('/api/events/:eventId', events.findById);

    // Alle rekening Routes
    const rekeningen = require('./controllers/rekening.controller.js');

    // Retrieve all Rekeningen
    app.get('/api/rekeningen', rekeningen.findAll);
 


    // Retrieve a single Event by Id
    app.get('/api/rekeningen/:rekeningId', rekeningen.findById);

    // Create a new Rekening
    app.post('/api/rekeningen', rekeningen.create);
*/

    const rekeningen = require('./controllers/rekening.controller.js');
    
    // Retrieve all Rekeningen grouped
    app.get('/api/groupedrekeningen', rekeningen.groupedOverview);

    // Create a new bunqRun
    app.post('/api/bunq/run', rekeningen.run);

}