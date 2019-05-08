//
require('dotenv').config();

const db = require('../config/db.config.js');
var moment = require('moment');
const path = require("path");
const arrays = require('../utils/arrays');
const fetch = require("node-fetch");

const solaredge_api_key = process.env.SOLAREDGE_API_KEY;

let siteID = '';
let inverterSN = '';
const solaredge_host = 'https://monitoringapi.solaredge.com';
const timeUnits = ['HOUR', 'DAY', 'MONTH', 'QUARTER_OF_AN_HOUR', 'YEAR']

const getSolarEdgeData = async (url) => {
	url = solaredge_host + url + "&api_key=" + solaredge_api_key + "&format=application/json";
	const [error, data] = await fetch(url);//.catch(err => console.log(err));
	if(!data) return ('no data');
	//console.log(data);
	return (await data.json());
}

const setupSolarEdge = async () => {
	
	if(siteID === ''){
		sites = await getSolarEdgeData('/sites/list?size=1');
		siteID = sites.sites.site[0].id;

		equipment = await getSolarEdgeData('/equipment/' + siteID + '/list?size=1')
		inverterSN = equipment.reporters.list[0].serialNumber;
		
		console.log(siteID, inverterSN);
	}else{
		console.log('Solaredge data al opgezocht');
	}
}
//setupSolarEdge();






/*
 * 731CE3F1-63
const siteData = async () => {
	const url = "https://monitoringapi.solaredge.com/sites/list?size=1&api_key=" + apikey + "&format=application/json";
	const response = await fetch(url);
	return( await response.json());
};
* */

async function getSolarEdgeInverterData(from, to){
	if(from === "0"){
		from = moment().add(-1, 'days').format("YYYY-MM-DD HH:mm:ss");
	}else{
		from = moment(from).format("YYYY-MM-DD HH:mm:ss");
	}
	
	if(to === "0"){
		to = moment().format("YYYY-MM-DD HH:mm:ss");
	}else{
		to = moment(to).format("YYYY-MM-DD HH:mm:ss");
	}
	return (await getSolarEdgeData('/equipment/' + siteID + '/' + inverterSN + '/data.json?startTime=' + from + '&endTime=' + to))
	//var url = "https://monitoringapi.solaredge.com/equipment/" + siteID + "/" + inverterSN + "/data.json?startTime=" + from + "&endTime=" + to + "&api_key=" + solaredge_api_key + "&format=application/json";
	//var data = await fetch(url);
	//return (await data.json());
}

exports.getInverterData = async (req, res) => {
	let data = await getSolarEdgeInverterData(req.params.start, req.params.end);
	let array = data.data.telemetries;
	for(var line of array){
		let index = array.findIndex((e) => e.date === line.date);
		var coeff = 1000 * 60 * 5;
		var date = new Date(line.date);  //or use any other date
		var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
		array[index]['date'] = rounded;
	}
	array.sort((a,b) => (a.date > b.date) ? 1 : -1); 
	data.data.telemetries = arrays.getDifferenceArray(array, 'date', ['totalEnergy']);
	res.send(data);
}

exports.getData = async (req, res) => {
	if(timeUnits.includes(req.params.timeUnit.toUpperCase()) === false){
		return res.status(500).send('Geen geldige timeUnit opgegeven (Opgegeven: ' + req.params.timeUnit + '). Geldige waarden zijn: ' + timeUnits);
	}
	res.send(await getSolarEdgeData('/site/' + siteID + '/energy?timeUnit=' + req.params.timeUnit.toUpperCase() + '&endDate=' + req.params.end + '&startDate=' + req.params.start));
	//var url = 'https://monitoringapi.solaredge.com/site/' + siteID + '/energy?timeUnit=' + req.params.timeUnit.toUpperCase() + '&endDate=' + req.params.end + '&startDate=' + req.params.start + '&api_key=' + solaredge_api_key + '&format=application/json';
	//var data = await fetch(url);
	//res.send(await data.json());
}

exports.getSiteData = async (req, res) => {
	res.send(await getSolarEdgeData('/sites/list?size=1'));
}

exports.getEquipmentData = async (req, res) => {
	res.send(await getSolarEdgeData('/equipment/' + siteID + '/list?size=1'));
}
/*
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
*/
