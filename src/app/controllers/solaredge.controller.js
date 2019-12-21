
const router = require('express').Router();
import SolarEdge from 'node-solaredge';

//import SolarEdge from '../modules/SolarEdge';
import {basicAuthentication} from '../middleware/authentication';
import asyncHandler from 'express-async-handler';
import cache from '../middleware/cacheMiddleware';
import Cache from '../modules/Cache';
const solarEdgeCache = new Cache();

const timeUnits = ['HOUR', 'DAY', 'MONTH', 'QUARTER_OF_AN_HOUR', 'YEAR']

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
