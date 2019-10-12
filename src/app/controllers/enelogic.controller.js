//
const router = require('express').Router();

import {oauthproviders} from '../modules/application_cache';
import {basicAuthentication} from '../middleware/authentication';
import cache from '../middleware/cacheMiddleware';
import Cache from '../modules/Cache';
import Enelogic from '../modules/Enelogic';
import asyncHandler from 'express-async-handler';

const enelogicCache = new Cache();

const test = async (req, res) => {
	let config = await db.apisettings.findOne({ where: {user: req.uid, name: 'enelogic'} })
	console.log(config);
	console.log(await oauthproviders['enelogic'].formatUrl())
	//var accessToken = await oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic');
	const accessTokenObject = await oauthproviders['enelogic'].refresh(config);
	res.send(accessTokenObject);
}

const getMeasuringPoints = async (req, res) => {
	if(req.query.access_token === undefined) return res.send({success: false, message: 'No query param access_token present'});
	const enelogic = new Enelogic(req.query.access_token);
	const measuringpoints = await enelogic.getMeasuringPoints();
	return res.send({success: true, data: measuringpoints});
}

const getData = async (req, res) => {
	if(req.query.access_token === undefined) return res.send({success: false, message: 'No query param access_token present'});
	const enelogic = new Enelogic(req.query.access_token);
	const options = {
		mpointelectra: req.query.mpointelectra
	}
	const data = await enelogic.getFormattedData(req.params.start, req.params.end, req.params.period.toUpperCase(), options);
	return res.send(data);
}

router.get('/data/:period/:start/:end', basicAuthentication, cache(enelogicCache), asyncHandler(getData));
router.get('/test', basicAuthentication, asyncHandler(test));
router.get('/measuringpoints', basicAuthentication, asyncHandler(getMeasuringPoints));


module.exports = router;

