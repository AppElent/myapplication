//
require('dotenv').config();

const db = require('../config/db.config.js');
var moment = require('moment');
const path = require("path");

const fetch = require("node-fetch");

const solaredge_api_key = process.env.SOLAREDGE_API_KEY;
var siteID = "1013066";
var inverterSN = "731CE3F1-63";

/*
const siteData = async () => {
	const url = "https://monitoringapi.solaredge.com/sites/list?size=1&api_key=" + apikey + "&format=application/json";
	const response = await fetch(url);
	return( await response.json());
};
* */

async function getSolarEdgeData(from, to){
	if(from === "0"){
		from = moment().add(-1, 'days').format("YYYY-MM-DD HH:mm:ss");
	}
	if(to === "0"){
		to = moment().format("YYYY-MM-DD HH:mm:ss");
	}
	var url = "https://monitoringapi.solaredge.com/equipment/" + siteID + "/" + inverterSN + "/data.json?startTime=" + from + "&endTime=" + to + "&api_key=" + solaredge_api_key + "&format=application/json";
	var data = await fetch(url);
	return (await data.json());
}

exports.getData = async (req, res) => {
	res.send(await getSolarEdgeData(req.params.start, req.params.end));
}

exports.getSiteData = async (req, res) => {
	var url = "https://monitoringapi.solaredge.com/sites/list?size=1&api_key=" + solaredge_api_key + "&format=application/json";
	var data = await fetch(url);
	res.send(await data.json());
}

exports.getEquipmentData = async (req, res) => {
	var url = "https://monitoringapi.solaredge.com/equipment/" + siteID + "/list?size=1&api_key=" + solaredge_api_key + "&format=application/json";
	var data = await fetch(url);
	res.send(await data.json());
}

exports.updateSolarEdgeData = async (req, res) => {
	let data = await getSolarEdgeData(req.params.start, req.params.end);
	//return res.send("ok");
	//console.log(data);
	for(var line of data.data.telemetries){
		var coeff = 1000 * 60 * 5;
		var date = new Date(line.date);  //or use any other date
		var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
		if([0, 15, 30, 45].includes(rounded.getMinutes())){
			//console.log(rounded, line);
			var values = {datetime: rounded, kwh_opwekking: line.totalEnergy}
			//console.log(values, rounded);
			var gevondenmeterstand = await db.meterstanden.findOne({ where: {datetime: rounded} });
			if(gevondenmeterstand == null){
				gevondenmeterstand = await db.meterstanden.create(values);
				//console.log("Moet toegevoegd worden");
			}else{
				gevondenmeterstand = await gevondenmeterstand.update(values);
				//console.log("Moet geupdate worden");
			}
		}
	}
	res.send("ok");
}
