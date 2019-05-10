const db = require('../config/db.config.js');
var moment = require('moment');
const fetch = require("node-fetch");

const Cache = require('../classes/Cache');
const defaultCache = new Cache(60*60*1);


const getOptions = (options) => {
    if(options === undefined) options = {}
    if(options.idColumnName === undefined) options.idColumnName = 'id';
    if(options.userColumnName === undefined) options.userColumnName = 'user';
    return options;
}

module.exports.get = (model, options) =>  async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    const entry = await model.findByPk(req.params[options.idColumnName]);
    if(!entry) return res.status(404).send('Niets gevonden')
    if(options.userColumnName !== null){
        if(entry[options.userColumnName] === undefined) return res.status(401).send('Geen user op model');
        if(entry[options.userColumnName] !== req.uid) return res.status(401).send('Niet toegestaan')
    }
    res.send(entry);
}

module.exports.findOne = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    const conditions = { where: {[req.params.column]: req.params.value} }
    if(options.userColumnName !== null) conditions.where[options.userColumnName] = req.uid;
    const entry = await model.findOne(conditions)
    if(!entry) return res.status(404).send('Niets gevonden')
    res.send(entry);
}

module.exports.list = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    const conditions = { where: {[options.userColumnName]: req.uid} }
    const entries = await model.findAll(conditions);

    res.send(entries)
}

module.exports.create = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    const body = req.body;
    body[options.userColumnName] = req.uid;
    const entry = await model.create(body)

    res.send(entry)
}

module.exports.update = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    const body = req.body;
    
    body[options.userColumnName] = req.uid;
    const entry = await model.update(body, {where: {[options.idColumnName]: req.params[options.idColumnName]}})

    res.send(entry)
}

module.exports.createOrUpdate = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    //const conditions = { where: {[req.params.column]: req.params.value} }
    //if(options.userColumnName !== null && req.jwt !== undefined) conditions.where[options.userColumnName] = req.uid;
    if(req.uid === undefined) return res.status(401).send('Geen token')
    const conditions = req.body.conditions;
    const body = req.body.body;
    conditions[options.userColumnName] = req.uid;
    body[options.userColumnName] = req.uid;
    let entry = await model.findOne(conditions)
    if(entry){
        entry = await entry.update(body)
    }else{
        entry = await model.create(body);
    }
    return res.send(entry)
}

module.exports.delete = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send('No token given')
    
    options = getOptions(options);
    model.destroy({ where: { [options.idColumnName]: req.params[options.idColumnName]  } })
    .then(success => res.status(200).end())
    .catch(err => res.status(500).send(err))
}
