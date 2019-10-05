
const router = require('express').Router();

import SolarEdge from '../modules/SolarEdge';
import {basicAuthentication} from '../middleware/authentication';
import asyncHandler from 'express-async-handler';
import cache from '../middleware/cacheMiddleware';
import Cache from '../modules/Cache';
const solarEdgeCache = new Cache();

const db = require('../models/index.js');
const fetch = require("node-fetch");


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

const getData = async (req, res) => {
	if(req.query.access_token === undefined) return res.send({success: false, message: 'No query param access_token present'});
	if(timeUnits.includes(req.params.period.toUpperCase()) === false){
		throw new Error('Geen geldige periode opgegeven (Opgegeven: ' + req.params.period + '). Geldige waarden zijn: ' + timeUnits);
	}
	const solaredge = new SolarEdge(req.query.access_token);
	const data = await solaredge.getData(req.params.site, req.params.start, req.params.end, req.params.period)
	return res.send({success: true, data});
}

const getSiteData = async (req, res) => {
	if(req.query.access_token === undefined) return res.send({success: false, message: 'No query param access_token present'});
	const solaredge = new SolarEdge(req.query.access_token);
	const sites = await solaredge.getSiteData();
	return res.send({success: true, data: sites});
}

const getEquipmentData = async (req, res) => {
	if(req.query.access_token === undefined) return res.send({success: false, message: 'No query param access_token present'});
	const solaredge = new SolarEdge(req.query.access_token);
	const equipment = await solaredge.getEquipmentData(req.params.site)
	return res.send({success: true, data: equipment});
}


//router.get('/sites/:period/:start/:end', basicAuthentication, cache(enelogicCache), getData);
router.get('/sites', basicAuthentication, asyncHandler(getSiteData));
router.get('/:site/equipment', basicAuthentication, asyncHandler(getEquipmentData));
router.get('/:site/data/:period/:start/:end', basicAuthentication, cache(solarEdgeCache), asyncHandler(getData));

module.exports = router;
