const db = require('../models/index.js');
var moment = require('moment');
const path = require("path");
const arrays = require('../utils/arrays');
const fetch = require("node-fetch");

const Cache = require('../modules/Cache');
const solarEdgeCache = new Cache(9999999);

const solaredge_host = 'https://monitoringapi.solaredge.com';
const timeUnits = ['HOUR', 'DAY', 'MONTH', 'QUARTER_OF_AN_HOUR', 'YEAR']

const getSolarEdgeConfig = async (user) => {
	let config = await db.apisettings.findOne({ where: {user: user, name: 'solaredge'} })
	if(config === null || config.success === false) return false;
	const apikey = config.access_token;
	
	//If siteId and inverterId are null then get and save them
	let updatedata = {};
	if(config.data1 === null){
		const sitedata = await (await fetch(solaredge_host + '/sites/list?size=1&api_key=' + apikey)).json();
		updatedata['data1'] = sitedata.sites.site[0].id;
		config.data1 = updatedata['data1']
	}
	if(config.data2 === null){
		const equipment = await (await fetch(solaredge_host + '/equipment/' + config.data1 + '/list?size=1&api_key=' + apikey)).json();
		updatedata['data2'] = equipment.reporters.list[0].serialNumber;
	}
	if(Object.getOwnPropertyNames(updatedata).length > 0) config = await config.update(updatedata);
	return config;
}

const getSolarEdgeData = async (user, url) => {
	const config = await getSolarEdgeConfig(req.uid);
	if(config === null || config === false) return res.status(404).send('No api key');
	const response = await fetch(solaredge_host + '/site/' + config.data1 + '/energy?timeUnit=' + req.params.timeUnit.toUpperCase() + '&endDate=' + req.params.end + '&startDate=' + req.params.start + '&api_key=' + config.access_token);
	return res.send(await response.json());
}

exports.getData = async (req, res) => {
	if(timeUnits.includes(req.params.timeUnit.toUpperCase()) === false){
		return res.status(500).send('Geen geldige timeUnit opgegeven (Opgegeven: ' + req.params.timeUnit + '). Geldige waarden zijn: ' + timeUnits);
	}
	const datakey = req.uid + '_data_' + req.params.timeUnit.toUpperCase() + '-' + req.params.start + '-' + req.params.end;
	
	const data = await solarEdgeCache.get(datakey, async () => {
		const config = await getSolarEdgeConfig(req.uid);
		if(config === null || config === false) return false;//return res.status(404).send('No api key');
		const response = await fetch(solaredge_host + '/site/' + config.data1 + '/energy?timeUnit=' + req.params.timeUnit.toUpperCase() + '&endDate=' + req.params.end + '&startDate=' + req.params.start + '&api_key=' + config.access_token);
		return (await response.json());
	})
	if(!data) return res.status(404).send('No api key');
	return res.send(data)
	//res.send(await getSolarEdgeData('/site/' + siteID + '/energy?timeUnit=' + req.params.timeUnit.toUpperCase() + '&endDate=' + req.params.end + '&startDate=' + req.params.start));
}

exports.getSiteData = async (req, res) => {
	const key = req.uid + '_site';
	const sitedata = await solarEdgeCache.get(key, async () => {
		const config = await getSolarEdgeConfig(req.uid);
		if(config === null || config === false) return res.status(404).send('No api key');
		const response = await fetch(solaredge_host + '/sites/list?size=1&api_key=' + config.access_token);
		return (await response.json());
	})
	return res.send(sitedata)
}

exports.getEquipmentData = async (req, res) => {
	const key = req.uid + '_equipment';
	const equipmentdata = await solarEdgeCache.get(key, async () => {
		const config = await getSolarEdgeConfig(req.uid);
		if(config === null || config === false) return res.status(404).send('No api key');
		const response = await fetch(solaredge_host + '/equipment/' + config.data1 + '/list?size=1&api_key=' + config.access_token);
		return (await response.json());
	})
	return res.send(equipmentdata)
}

