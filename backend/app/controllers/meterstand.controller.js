//
const db = require('../config/db.config.js');
const MeterstandElektra = db.meterstandenelektra;
var moment = require('moment');
const path = require("path");

var request = require('request'); 
const fetch = require("node-fetch");

//var apikey = "ODE5NzlmMDBmZWNiMjZkMGU0NDcxZDI5MDJjMjRmMTdlMmI1NTE2M2FhYThhZmJlNTYwZDM3YTM1MzRhNTBkYw";
var host = 'https://enelogic.com';
var measuringpoint = "165704";
var JSONStore = require('json-store');





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

var enelogic_store = JSONStore(`${__dirname}${path.sep}enelogic.json`);

// Enelogic oauth object maken
const tokenObject = enelogic_store.get('enelogic');

//Function to refresh Enelogic oauth token
async function refreshEnelogicOauthToken(){
	//accessToken =  await accessToken.refresh().catch(error => console.log(error))
	if (accessToken.expired()) {
		try {
			accessToken =  await accessToken.refresh();
			console.log("Accesstoken vernieuwd", accessToken);
			enelogic_store.set('enelogic', accessToken);
		} catch (error) {
			console.log('Error refreshing access token: ', error.message);
		}
	}else{
		console.log("Accesstoken van enelogic is niet verlopen", accessToken);
	}
}

// Create the access token wrapper
var accessToken = enelogic_oauth.accessToken.create(tokenObject);

if(accessToken !== null){
	refreshEnelogicOauthToken();	
}

async function updateDagStanden(){
	let apikey = enelogic_store.get('enelogic').token.access_token;
	const laatstestand = await MeterstandElektra.findOne({ where: { kwh_181: { $ne: null } 	}, order: [ [ 'datetime', 'DESC' ]],})
	var now = moment().add(1, 'days');
	var day = moment().add(-30, 'days');
	if(laatstestand !== null){
		day = moment(laatstestand.datetime);
	}	
	console.log(laatstestand);
	console.log("datum: " + laatstestand.datetime);
	console.log("day: " + day.format("YYYY-MM-DD HH:mm"));
	var datapointUrl = host+'/api/measuringpoints/'+measuringpoint+'/datapoint/days/'+day.format("YYYY-MM-DD")+'/'+now.format('YYYY-MM-DD')+'?access_token='+apikey;
	console.log(datapointUrl);
	const response = await fetch(datapointUrl);
	const meterstanden = await response.json();
	console.log(meterstanden);
	var standinit = meterstanden[0];
	var values = {datetime: standinit.date, ['kwh_' + standinit.rate]: standinit.quantity}
	console.log(values);
	var i = 0;
	for(const stand of meterstanden){
		var datum = moment(stand.date);
		datum = datum.tz('Europe/Amsterdam');
		console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
		values = {datetime: datum, ['kwh_' + stand.rate]: stand.quantity}
		var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: stand.date} });
		if(gevondenmeterstand == null){
			gevondenmeterstand = await MeterstandElektra.create(values);
			//console.log("Moet toegevoegd worden");
		}else{
			gevondenmeterstand = await gevondenmeterstand.update(values);
			//console.log("Moet geupdate worden");
		}
	}
	console.log("klaar");

		/*
		.then(laatstestand => {
		//res.write(laatstestand);
		var date = "2017-03-01";
		if(laatstestand !== null){
			date = laatstestand.datetime;
		}	
		var day = moment(date);
		var now = moment();
		now = now.add(-1, 'days');	
		var datapointUrl = host+'/api/measuringpoints/'+measuringpoint+'/datapoint/days/'+day.format("YYYY-MM-DD")+'/'+now.format('YYYY-MM-DD')+'?access_token='+apikey;
		console.log(datapointUrl);
		request(datapointUrl, async function(err, meterstanden){
			//console.log(meterstanden);
			var meterstandendata = JSON.parse(meterstanden.body);
			console.log(meterstandendata[0].rate);
			var standinit = meterstandendata[0];
			var values = {datetime: standinit.date, ['kwh_' + standinit.rate]: standinit.quantity}
			console.log(values);
			var i = 0;
			for(const stand of meterstandendata){
				var datum = moment(stand.date);
				datum = datum.tz('Europe/Amsterdam');
				console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
				values = {datetime: datum, ['kwh_' + stand.rate]: stand.quantity}
				var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: stand.date} });
				if(gevondenmeterstand == null){
					gevondenmeterstand = await MeterstandElektra.create(values);
					//console.log("Moet toegevoegd worden");
				}else{
					gevondenmeterstand = await gevondenmeterstand.update(values);
					//console.log("Moet geupdate worden");
				}
			}
			console.log("klaar");
		})
	});
	*/
}

async function updateKwartierStanden(){
	let apikey = enelogic_store.get('enelogic').token.access_token;
	const laatstestand = await MeterstandElektra.findOne({ where: { kwh_180: { $ne: null } 	}, order: [ [ 'datetime', 'DESC' ]],})
	console.log(laatstestand);
	console.log("laatstestand: " + laatstestand.datetime);
	var now = moment().add(-1, 'days');
	var day = moment().add(-30, 'days');
	if(laatstestand !== null){
		day = moment(laatstestand.datetime);
	}	
	console.log("day: " + day.format("YYYY-MM-DD HH:mm"));
	while(day.add(1, 'days').isBefore(now)){
		var datapointUrl = host+'/api/measuringpoints/'+measuringpoint+'/datapoints/'+day.format("YYYY-MM-DD")+'/'+day.add(1, 'days').format('YYYY-MM-DD')+'?access_token='+apikey;
		console.log(datapointUrl);
		const response = await fetch(datapointUrl);
		const meterstanden = await response.json();
		console.log(meterstanden[0]);
		var standinit = meterstanden[0];
		var values = {datetime: standinit.datetime, ['kwh_' + standinit.rate]: standinit.quantity}
		console.log(values);
		var i = 0;
		
		for(const stand of meterstanden){
			var datum = moment(stand.datetime);
			datum = datum.tz('Europe/Amsterdam');
			console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
			values = {datetime: datum, ['kwh_' + stand.rate]: stand.quantity}
			var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: stand.datetime} });
			if(gevondenmeterstand == null){
				gevondenmeterstand = await MeterstandElektra.create(values);
				//console.log("Moet toegevoegd worden");
			}else{
				gevondenmeterstand = await gevondenmeterstand.update(values);
				//console.log("Moet geupdate worden");
			}
		}
		
		console.log("klaar");
	}
	
	
	
	/*
	MeterstandElektra.findOne({
		where: {
			kwh_180: {
				$ne: null
			}
		},
		order: [ [ 'datetime', 'DESC' ]],}).then(laatstestand => {
		//res.write(laatstestand);
		var date = "2019-01-01";
		if(laatstestand !== null){
			date = laatstestand.datetime;
		}	
		var day = moment(date);
		var now = moment();
		now = now.add(-1, 'days');
		
		while(day.add(1, 'days').isBefore(now)){
			var datapointUrl = host+'/api/measuringpoints/'+measuringpoint+'/datapoints/'+day.format("YYYY-MM-DD")+'/'+day.add(1, 'days').format('YYYY-MM-DD')+'?access_token='+apikey;
			console.log(datapointUrl);
			request(datapointUrl, async function(err, meterstanden){
				//console.log(meterstanden);
				var meterstandendata = JSON.parse(meterstanden.body);
				console.log(meterstandendata[0]);
				var standinit = meterstandendata[0];
				var values = {datetime: standinit.datetime, ['kwh_' + standinit.rate]: standinit.quantity}
				console.log(values);
				var i = 0;
				
				for(const stand of meterstandendata){
					var datum = moment(stand.datetime);
					datum = datum.tz('Europe/Amsterdam');
					console.log("Nummer " + i + " heeft rate " + stand.rate + " en waarde " + stand.quantity + " en datum " + datum.format("YYYY-MM-DD HH:mm"));
					values = {datetime: datum, ['kwh_' + stand.rate]: stand.quantity}
					var gevondenmeterstand = await MeterstandElektra.findOne({ where: {datetime: stand.datetime} });
					if(gevondenmeterstand == null){
						gevondenmeterstand = await MeterstandElektra.create(values);
						//console.log("Moet toegevoegd worden");
					}else{
						gevondenmeterstand = await gevondenmeterstand.update(values);
						//console.log("Moet geupdate worden");
					}
				}
				
				console.log("klaar");
			})
			day = day.add(1, 'days');
		}
	})
	*/
}

exports.formatEnelogicAuthorizationUrl = (req, res) =>{

		// Authorization oauth2 URI
		const authorizationUri = enelogic_oauth.authorizationCode.authorizeURL({
		  redirect_uri: process.env.ENELOGIC_REDIRECT_URI,
		  scope: 'account' 
		});

		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.redirect(authorizationUri);
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
			accessToken = enelogic_oauth.accessToken.create(result);
			enelogic_store.set('enelogic', accessToken);
			res.send(accessToken);
		} catch (error) {
			console.log('Access Token Error', error.message);
		}
	}
}


exports.refreshEnelogicOauthToken = async (req, res) => {
	// Check if the token is expired. If expired it is refreshed.
	await refreshEnelogicOauthToken();
	res.send(accessToken);
}


exports.updateElektraMeterstanden = async (req, res) => {
	await updateKwartierStanden();
	await updateDagStanden();
	
	
	res.send("ok");
}

