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



const oauth_credentials = {}

/*
 * Enelogic OAUTH
 * 
 */

// Set the configuration settings
const enelogic_credentials = {
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
const enelogic_oauth = require('simple-oauth2').create(enelogic_credentials);
oauth_credentials['enelogic'] = {
	redirect_uri: 'https://ericjansen.dynu.net/enelogic/oauth', 
	object: enelogic_oauth,
	scope: 'account',
	type: 'authorization_code_flow'
};

/*
// Initialize the OAuth2 Library
const enelogic_oauth = require('simple-oauth2').create(credentials);

//Initialize JSON store for oauth keys
const enelogic_store = JSONStore(`${__dirname}${path.sep}enelogic.json`);

// Enelogic oauth object maken
//var accessToken = '';
//oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic').then(token => {accessToken = token});
* */

exports.format = (req, res) => {
		
		const oauthobject = oauth_credentials[req.params.application].object;
		// Authorization oauth2 URI
		const authorizationUri = oauthobject.authorizationCode.authorizeURL({
		  redirect_uri: oauth_credentials[req.params.application].redirect_uri,
		  scope: oauth_credentials[req.params.application].scope 
		});

		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.send(authorizationUri);
}

exports.exchange = async (req, res) => {
	const oauthobject = oauth_credentials[req.params.application].object;
	
	// Get the access token object (the authorization code is given from the previous step).
	const tokenConfig = {
	  code: req.body.code,
	  redirect_uri: oauth_credentials[req.params.application].redirect_uri,
	  scope: oauth_credentials[req.params.application].scope , // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
	};
	console.log(tokenConfig)
	// Save the access token
	try {
		const result = await oauthobject.authorizationCode.getToken(tokenConfig)
		console.log(result);
		return res.send(oauthobject.accessToken.create(result));
	}catch (error) {
		return res.status(500).send('Creation failed: ' + error)
	}
}



exports.refresh = async (req, res) => {
	// Check if the token is expired. If expired it is refreshed.
	//await refreshEnelogicOauthToken();
	res.send(req);
}


