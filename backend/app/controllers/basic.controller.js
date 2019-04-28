const db = require('../config/db.config.js');
var moment = require('moment');
const fetch = require("node-fetch");


module.exports.get = (model) =>  async (req, res) => {
   const entry = await model.findByPk(req.params.id);

   res.send(entry);
}

module.exports.findOne = (model) =>  async (req, res) => {
   const entry = await model.findOne({ where: {[req.params.column]: req.params.value} })

   res.send(entry);
}

module.exports.list = (model) => async (req, res) => {
   const entries = await model.findAll();

   res.send(entries)
}

module.exports.create = (model) => async (req, res) => {
   const entry = await model.create(req.body)

   res.send(entry)
}

module.exports.update = (model) => async (req, res) => {
   const entry = await model.update(req.body)

   res.send(entry)
}

module.exports.update = (model) => async (req, res) => {
   const entry = await model.destroy({ where: { id: req.params.id  } })

   res.send(entry)
}
