//
const db = require('../config/db.config.js');
const MeterstandElektra = db.meterstanden;
var moment = require('moment');
const path = require("path");

var request = require('request'); 
const fetch = require("node-fetch");

//var apikey = "ODE5NzlmMDBmZWNiMjZkMGU0NDcxZDI5MDJjMjRmMTdlMmI1NTE2M2FhYThhZmJlNTYwZDM3YTM1MzRhNTBkYw";
var host = 'https://enelogic.com';
var measuringpoint = "165704";
var JSONStore = require('json-store');


//console.log(db);


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
		values = {datetime: datum, ['kwh_' + stand.rate]: stand.quantity}
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
	let result = [];
	if(req.body.kwartierstanden_from !== null){
		//result.push(await updateMeterstanden(req.body.kwartierstanden_from, req.body.kwartierstanden_to, "kwartier"));
	}
	if(req.body.dagstanden_from !== null){
		result.push(await updateMeterstanden(req.body.dagstanden_from, req.body.dagstanden_to, "day"));
	}
	res.send(result);
}


