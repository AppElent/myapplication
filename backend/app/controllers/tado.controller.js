//
const db = require('../config/db.config.js');
const fetch = require("node-fetch");
const fetching = require('../utils/fetching');


const home = '113447';

//https://shkspr.mobi/blog/2019/02/tado-api-guide-updated-for-2019/

// Set the configuration settings
const credentials = {
  client: {
    id: 'tado-web-app',
    secret: 'wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc'
  },
  auth: {
    tokenHost: 'https://auth.tado.com',
    tokenPath: '/oauth/token'
  }
};

const tokenConfig = {
  username: 'ericjansen@live.nl',
  password: process.env.TADO_PASSWORD,
  scope: 'home.user', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
};

// Initialize the OAuth2 Library
const tado_oauth = require('simple-oauth2').create(credentials);


async function getAccessToken(tado_oauth, tokenConfig){ 
	try {
	  const result = await tado_oauth.ownerPassword.getToken(tokenConfig);
	  return (await tado_oauth.accessToken.create(result));
	} catch (error) {
	  console.log('Access Token Error', error.message);
	  return undefined;
	}
};

async function refreshAccessToken(){
	// Check if the token is expired. If expired it is refreshed.
	if (accessToken.expired()) {
	  try {
		accessToken = await accessToken.refresh();
	  } catch (error) {
		console.log('Error refreshing access token: ', error.message);
	  }
	}

}

var accessToken = "";
getAccessToken(tado_oauth, tokenConfig).then(data => {accessToken = data;});

exports.test = async (req, res) => {
	const url = 'https://my.tado.com/api/v1/me';
	await refreshAccessToken();
	var data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);
	
	res.send({data, accessToken});
}

exports.homes = async (req, res) => {
	const url = 'https://my.tado.com/api/v2/homes/' + home;
	await refreshAccessToken();
	var data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);
	
	res.send({data});
}

exports.zones = async (req, res) => {
	const url = 'https://my.tado.com/api/v2/homes/' + home + '/zones';
	await refreshAccessToken();
	var data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);
	
	res.send({data});
}

exports.report = async (req, res) => {
	const url = 'https://my.tado.com/api/v2/homes/' + home + '/zones/' + req.params.zone + '/dayReport/?date=' + req.params.date;
	await refreshAccessToken();
	var data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);
	
	res.send({data});
}





