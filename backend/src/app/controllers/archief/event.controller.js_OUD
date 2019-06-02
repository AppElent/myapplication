
const db = require('../config/db.config.js');
const Event = db.events;
 
// Post an Event
exports.create = (req, res) => {	
	// Save to MySQL database
	Event.create({  
	  value: req.body.value
	}).then(event => {		
		// Send created event to client
		res.send(event);
	});
};
 
// FETCH all Events
exports.findAll = (req, res) => {
	Event.findAll().then(events => {
	  // Send all customers to Client
	  res.send(events);
	});
};
 
// Find a Customer by Id
exports.findById = (req, res) => {	
	Event.findById(req.params.eventId).then(event => {
		res.send(event);
	})
};
 
/*
// Update a Customer
exports.update = (req, res) => {
	const id = req.params.customerId;
	Customer.update( { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age }, 
					 { where: {id: req.params.customerId} }
				   ).then(() => {
					 res.status(200).send("updated successfully a customer with id = " + id);
				   });
};
 
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.customerId;
	Customer.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send('deleted successfully a customer with id = ' + id);
	});
};
*/