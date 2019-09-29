//
const router = require('express').Router();
//const auth = require('../middleware/authentication');

const db = require('../models');
const MeterstandElektra = db.meterstanden;
var moment = require('moment');
const fetch = require("node-fetch");

var host = 'https://enelogic.com';

const Cache = require('../modules/Cache');
const enelogicCache = new Cache();

import {oauthproviders} from '../modules/application_cache';
import {basicAuthentication} from '../middleware/authentication';
import cache from '../middleware/cacheMiddleware';
import Enelogic from '../modules/Enelogic';

const getEnelogicData = (period) => async (req, res) => {
//async function getMeterstanden(from, to, period){
	console.log(1);
	//---const cachekey = req.uid + '_' + period.toUpperCase() + '_' + req.params.start + '_' + req.params.end;
	//---const cachedata = await enelogicCache.simpleGet(cachekey);
	//---if(cachedata !== null) return res.send(cachedata);
		
	let from = req.params.start;
	let to = (period === 'day' ? req.params.end : moment(req.params.start).add(1, 'days').format('YYYY-MM-DD'))

	let results = [];
	let config = await db.apisettings.findOne({ where: {user: req.uid, name: 'enelogic'} })
	if(config === null || config.success === false) return res.status(404).send(config);
	//var accessToken = await oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic');
	const accessTokenObject = await oauthproviders['enelogic'].refresh(config);
	config.update({access_token: accessTokenObject.access_token, refresh_token: accessTokenObject.refresh_token, expires_at: accessTokenObject.expires_at});
	let apikey = accessTokenObject.token.access_token;
	console.log(accessTokenObject);
	//Measuringpoint ophalen en zetten indien nodig
	if(config.data1 === null){
		const measuringpointsresponse = await fetch(host + '/api/measuringpoints?access_token=' + apikey)
		const measuringpoints = await measuringpointsresponse.json();
		if (measuringpoints.length === 1) {
			config = await config.update({data1: measuringpoints[0].id, data2: measuringpoints[0].dayMin});
		}else{
			const electricity = measuringpoints.find(entry => entry.unitType === 0)
			const gas = measuringpoints.find(entry => entry.unitType === 1)
			const values = {data1: electricity.id, data2: electricity.dayMin, data5: gas.id, data6: gas.dayMin}
			config = await config.update(values);
		}
	}
	
	//Als datum voor de eerste datum ligt dan die datum zetten
	if(from === '0'){
		from === moment(config.data2).format('YYYY-MM-DD');
	}else if(moment(from).isBefore(moment(config.data2))){
		from = moment(config.data2).format('YYYY-MM-DD')
	}
	
	console.log(3);
	const baseUrl = 'https://enelogic.com/api/measuringpoints/'+config.data1;
	let datapointUrl = baseUrl+'/datapoints/'+from+'/'+to+'?access_token='+apikey;
	if(period === "day"){
		datapointUrl = baseUrl+'/datapoint/days/'+from+'/'+to+'?access_token='+apikey;
	}
	if(period === "quarter"){
		const totalUrl = baseUrl+'/datapoint/days/'+from+'/'+to+'?access_token='+apikey;
		const totalresponse = await fetch(totalUrl);
		const totals = (await totalresponse.json());
		for(var line of totals){
			const index = results.findIndex((e) => e.datetime === line.date);
			let obj = {datetime: (line.date), [line.rate]: Math.round(parseFloat(line.quantity)*1000)}
			if(index === -1){
				results.push(obj);
			}else{
				results[index][line.rate] = parseFloat(line.quantity)*1000
			}
			
		}
	}
	console.log("Url: " + datapointUrl);
	const response = await fetch(datapointUrl);
	const jsondata = await response.json();
	console.log(response);
	for(var line of jsondata){
		let date = (period === 'quarter' ? line.datetime : line.date);
		//let found = results.find(x => x.datetime === date);
		let index = results.findIndex((e) => e.datetime === date);
		let obj = {datetime: date, [line.rate]: Math.round(parseFloat(line.quantity)*1000)}
		if(index === -1){
			results.push(obj);
		}else{
			results[index][line.rate] = Math.round(parseFloat(line.quantity)*1000)
		}
		
	}
	results.sort((a,b) => (a.datetime > b.datetime) ? 1 : -1); 

	let previous = results[0];
	for(var entry of results){
		let index = results.findIndex((e) => e.datetime === entry.datetime);
		
		if(period === 'day'){
			results[index][180] = entry[181] + entry[182];
			results[index][280] = entry[281] + entry[282];
		}else{
			let difference1 = entry[180]-previous[180];
			if(entry[280] === undefined) {entry[280] = 0;previous[280] = 0;}
			let difference2 = entry[280]-previous[280];
			//console.log(index, difference1, difference2);
			let date = new Date(entry.datetime);
			let starthoog = moment(date).hours(7).minutes(0).seconds(0);
			let startlaag = moment(date).hours(23).minutes(0).seconds(0);
			//console.log(date.getDay(), starthoog.toDate().getTime(), startlaag.toDate().getTime(), date.getTime());
			entry[181] = previous[181];
			entry[182] = previous[182];
			entry[281] = previous[281];
			entry[282] = previous[282];
			if(date.getDay() === 0 || date.getDay() === 6 || date.getTime() <= starthoog.toDate().getTime() || date.getTime() > startlaag.toDate().getTime()){
				entry[181] += difference1;
				entry[281] += difference2;
			}else{
				entry[182] += difference1;
				entry[282] += difference2;
			}
			if (entry[281] === undefined) entry[281] = 0;
			if (entry[282] === undefined) entry[282] = 0;
			results[index] = entry;
			
			//previous1 = entry[180];
			//previous2 = entry[280];
			previous = entry;
		}
	}
	//results = arrays.getDifferenceArray(results, 'datetime', ['180', '181', '182', '280', '281', '282']);
	enelogicCache.save(cachekey, results)
	return res.send(results);
}

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

//router.get('/data/dag/:start/:end', basicAuthentication, getEnelogicData('day'));
//router.get('/data/kwartier/:start/:end', basicAuthentication, getEnelogicData('quarter'));
//router.get('/data/dag/:start/:end', basicAuthentication, cache(enelogicCache), getData('DAY'));
//router.get('/data/kwartier/:start/:end', basicAuthentication, cache(enelogicCache), getData('QUARTER_OF_AN_HOUR'));
router.get('/data/:period/:start/:end', basicAuthentication, cache(enelogicCache), getData);
router.get('/test', basicAuthentication, test);
router.get('/measuringpoints', basicAuthentication, getMeasuringPoints);


module.exports = router;

/*

async function updateMeterstanden(from, to, period){
	let apikey = enelogic_store.get('enelogic').token.access_token;
	//let fromObj = moment(from);
	//let toObj = moment(to);
	const baseUrl = host+'/api/measuringpoints/'+measuringpoint;
	let datapointUrl = baseUrl+'/datapoints/'+from+'/'+to+'?access_token='+apikey;
	if(period === "day"){
		datapointUrl = baseUrl+'/datapoint/days/'+from+'/'+to+'?access_token='+apikey;
	}
	console.log("Url: " + datapointUrl);
	const response = await fetch(datapointUrl);
	const meterstanden = await response.json();
	for(const stand of meterstanden){
		var datumveld = (period === "day" ? stand.date : stand.datetime)
		var datum = moment(datumveld);
		
		datum = datum.tz('Europe/Amsterdam');
		//console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
		var quantity = parseFloat(stand.quantity)*1000;
		values = {datetime: datum, ['kwh_' + stand.rate]: quantity.toString()}
		var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: datumveld} });
		if(gevondenmeterstand == null){
			gevondenmeterstand = await MeterstandElektra.create(values);
			//console.log("Moet toegevoegd worden");
		}else{
			gevondenmeterstand = await gevondenmeterstand.update(values);
			//console.log("Moet geupdate worden");
		}
	}
	return {success: true}
}






exports.updateElektraMeterstanden = async (req, res) => {
	let result = [];
	if(req.body.kwartierstanden_from !== null){
		//result.push(await updateMeterstanden(req.body.kwartierstanden_from, req.body.kwartierstanden_to, "kwartier"));
	}
	if(req.body.dagstanden_from !== null){
		result.push(await updateMeterstanden(req.body.dagstanden_from, req.body.dagstanden_to, "day"));
	}
	res.send(result);
}

exports.updateEnelogicData = async (req, res) => {
	if(req.params.type === 'quarter'){
		var start = new Date(req.params.start);
		var end = new Date(req.params.end);
		while(true){
			console.log(start);
			//console.log(moment(start).format('YYYY-MM-DD') +  " tot " + moment(start).add(1, 'days').format('YYYY-MM-DD'))
			await updateMeterstanden(moment(start).format('YYYY-MM-DD'), moment(start).add(1, 'days').format('YYYY-MM-DD'), req.params.type)
			start.setDate(start.getDate() + 1);
			if(start.toISOString() === end.toISOString()){
				return res.send("ok");
			}
		}
	}else{
		res.send (await updateMeterstanden(req.params.start, req.params.end, req.params.type));
	}
	
	
}
* 



exports.getEnelogicDagData = async (req, res) => {
	res.send (await getMeterstanden(req.params.start, req.params.end, 'day'));
}

exports.getEnelogicKwartierData = async (req, res) => {
	var enddate = moment(req.params.datum).add(1, 'days');
	res.send (await getMeterstanden(req.params.datum, enddate.format('YYYY-MM-DD'), 'quarter'));
}
* */


/*


//var apikey = "ODE5NzlmMDBmZWNiMjZkMGU0NDcxZDI5MDJjMjRmMTdlMmI1NTE2M2FhYThhZmJlNTYwZDM3YTM1MzRhNTBkYw";

var measuringpoint = "165704";



// Set the configuration settings
const credentials = {
  client: {
    id: process.env.ENELOGIC_CLIENT_ID,
    secret: process.env.ENELOGIC_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://enelogic.com',
    tokenPath: '/oauth/v2/token',
    authorizePath: '/oauth/v2/auth'
  }
};

// Initialize the OAuth2 Library
const enelogic_oauth = require('simple-oauth2').create(credentials);

//Initialize JSON store for oauth keys
const enelogic_store = JSONStore(`${__dirname}${path.sep}enelogic.json`);

// Enelogic oauth object maken
//var accessToken = '';
//oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic').then(token => {accessToken = token});

exports.formatUrl = (req, res) =>{

		// Authorization oauth2 URI
		const authorizationUri = enelogic_oauth.authorizationCode.authorizeURL({
		  redirect_uri: process.env.ENELOGIC_REDIRECT_URI,
		  scope: 'account' 
		});

		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.redirect(authorizationUri);
}

exports.format = (req, res) => {
		// Authorization oauth2 URI
		const authorizationUri = enelogic_oauth.authorizationCode.authorizeURL({
		  redirect_uri: 'https://ericjansen.dynu.net/enelogic/oauth',
		  scope: 'account' 
		});

		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.send(authorizationUri);
}

exports.exchange = async (req, res) => {
	// Get the access token object (the authorization code is given from the previous step).
	const tokenConfig = {
	  code: req.body.code,
	  redirect_uri: 'https://ericjansen.dynu.net/enelogic/oauth',
	  scope: 'account', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
	};
	console.log(tokenConfig)
	// Save the access token
	try {
		const result = await enelogic_oauth.authorizationCode.getToken(tokenConfig)
		console.log(result);
		//enelogic_store.set('enelogic', result);
		return res.send(enelogic_oauth.accessToken.create(result));
		//accessToken = enelogic_oauth.accessToken.create(result);
		//enelogic_store.set('enelogic', accessToken);
		//res.redirect(process.env.APP_ROOT);
	} catch (error) {
		return res.status(500).send('Creation failed: ' + error)
	}
}



exports.exchangeEnelogicOauthToken = async (req, res) => {
	if(req.query.code == null){
		res.send("Geen auth code meegegeven");
	}else{
		// Get the access token object (the authorization code is given from the previous step).
		const tokenConfig = {
		  code: req.query.code,
		  redirect_uri: process.env.ENELOGIC_REDIRECT_URI,
		  scope: 'account', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
		};

		// Save the access token
		try {
			const result = await enelogic_oauth.authorizationCode.getToken(tokenConfig)
			console.log(result);
			//enelogic_store.set('enelogic', result);
			accessToken = enelogic_oauth.accessToken.create(result);
			enelogic_store.set('enelogic', accessToken);
			res.redirect(process.env.APP_ROOT);
		} catch (error) {
			console.log('Access Token Error', error.message);
		}
	}
}


exports.refresh = async (req, res) => {
	// Check if the token is expired. If expired it is refreshed.
	//await refreshEnelogicOauthToken();
	res.send(req);
}

*/


