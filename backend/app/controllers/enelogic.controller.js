//
const db = require('../config/db.config.js');
const MeterstandElektra = db.meterstanden;
var moment = require('moment');
const path = require("path");

var request = require('request'); 
const fetch = require("node-fetch");
var JSONStore = require('json-store');

const oauth = require('../utils/oauth');

const arrays = require('../utils/arrays');





//var apikey = "ODE5NzlmMDBmZWNiMjZkMGU0NDcxZDI5MDJjMjRmMTdlMmI1NTE2M2FhYThhZmJlNTYwZDM3YTM1MzRhNTBkYw";
var host = 'https://enelogic.com';
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
		  redirect_uri: 'http://192.168.178.108:3000/enelogic/oauth',
		  scope: 'account' 
		});

		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.send(authorizationUri);
}

exports.exchange = async (req, res) => {
	// Get the access token object (the authorization code is given from the previous step).
	const tokenConfig = {
	  code: req.body.code,
	  redirect_uri: 'http://192.168.178.108:3000/enelogic/oauth',
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





async function getMeterstanden(from, to, period){
	let earliest = '2017-02-10';
	if(from === '0'){
		from = earliest;
	}
	let results = []
	var accessToken = await oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic');
	let apikey = accessToken.token.access_token;
	const baseUrl = host+'/api/measuringpoints/'+measuringpoint;
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
	//let previous1 = results[0][180];
	//let previous2 = results[0][280];
	//let start1a = results[0][181];
	//let start1b = results[0][182];
	//let start2a = results[0][281];
	//let start2b = results[0][282];
	let previous = results[0];
	for(var entry of results){
		let index = results.findIndex((e) => e.datetime === entry.datetime);
		
		if(period === 'day'){
			results[index][180] = entry[181] + entry[182];
			results[index][280] = entry[281] + entry[282];
		}else{
			let difference1 = entry[180]-previous[180];
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
			
			results[index] = entry;
			
			//previous1 = entry[180];
			//previous2 = entry[280];
			previous = entry;
		}
	}
	results = arrays.getDifferenceArray(results, 'datetime', ['180', '181', '182', '280', '281', '282']);
	return (results);
}

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


exports.getEnelogicDagData = async (req, res) => {
	res.send (await getMeterstanden(req.params.start, req.params.end, 'day'));
}

exports.getEnelogicKwartierData = async (req, res) => {
	var enddate = moment(req.params.datum).add(1, 'days');
	res.send (await getMeterstanden(req.params.datum, enddate.format('YYYY-MM-DD'), 'quarter'));
}
