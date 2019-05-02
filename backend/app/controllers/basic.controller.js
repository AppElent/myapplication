const db = require('../config/db.config.js');
var moment = require('moment');
const fetch = require("node-fetch");


module.exports.get = (model, idColumnName = 'id', userColumnName = 'user') =>  async (req, res) => {
    const entry = await model.findByPk(req.params[idColumnName]);
    if(!entry) return res.status(404).send('Niets gevonden')
    if(userColumnName !== null){
	if(entry[userColumnName] === undefined) return res.status(401).send('Geen user op model');
	if(req.jwt === undefined) return res.status(401).send('Geen token')
	if(entry[userColumnName] !== req.jwt.claims.uid) return res.status(401).send('Niet toegestaan')
    }
    res.send(entry);
}

module.exports.findOne = (model, userColumnName = 'user') =>  async (req, res) => {
    const conditions = { where: {[req.params.column]: req.params.value} }
    if(userColumnName !== null && req.jwt !== undefined) conditions.where[userColumnName] = req.jwt.claims.uid;
    const entry = await model.findOne(conditions)
    if(!entry) return res.status(404).send('Niets gevonden')
    res.send(entry);
}

module.exports.list = (model, userColumnName = 'user') => async (req, res) => {
    const conditions = { where: {[userColumnName]: req.jwt.claims.uid} }
    
    const entries = await model.findAll(conditions);

    res.send(entries)
}

module.exports.create = (model, userColumnName = 'user') => async (req, res) => {
    const body = req.body;
    if(req.jwt === undefined) return res.status(401).send('Geen token')
    body[userColumnName] = req.jwt.claims.uid;
    const entry = await model.create(body)

    res.send(entry)
}

module.exports.update = (model, idColumnName = 'id', userColumnName = 'user') => async (req, res) => {
    const body = req.body;
    if(req.jwt === undefined) return res.status(401).send('Geen token')
    body[userColumnName] = req.jwt.claims.uid;
    const entry = await model.update(body, {where: {[idColumnName]: req.params[idColumnName]}})

    res.send(entry)
}

module.exports.delete = (model, idColumnName = 'id', userColumnName = 'user') => async (req, res) => {
    const entry = await model.destroy({ where: { id: req.params[idColumnName]  } })
    console.log(entry);
    res.send(entry)
}
