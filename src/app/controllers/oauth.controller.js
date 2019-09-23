//
const db = require('../models/index.js');
const MeterstandElektra = db.meterstanden;
var moment = require('moment');
const path = require("path");

var request = require('request'); 
const fetch = require("node-fetch");
var JSONStore = require('json-store');

const arrays = require('../utils/arrays');

import {oauthproviders} from '../modules/application_cache';



const oauth_credentials = {}

/*
 * Enelogic OAUTH
 * 
 */

// Set the configuration settings
/*
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
* */

/*
// Initialize the OAuth2 Library
const enelogic_oauth = require('simple-oauth2').create(credentials);

//Initialize JSON store for oauth keys
const enelogic_store = JSONStore(`${__dirname}${path.sep}enelogic.json`);

// Enelogic oauth object maken
//var accessToken = '';
//oauth.retrieveAccessTokenObject(enelogic_oauth, enelogic_store, 'enelogic').then(token => {accessToken = token});
* */

exports.format = () => (req, res) => {
	const oauthobject = oauthproviders[req.params.application];
	// Authorization oauth2 URI
	//const protocol = (req.params.application.toLowerCase() === 'bunq' ? 'https' : req.protocol);
	//const redirecthost = protocol + '://' + req.get('host');
	const authorizationUri = oauthobject.formatUrl();

	// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
	return res.send(authorizationUri);
}

exports.exchange = () => async (req, res) => {
	const oauthobject = oauthproviders[req.params.application];
	
	// Get the access token object (the authorization code is given from the previous step).
	//const redirecthost = req.protocol + '://' + req.get('host');
	const tokenConfig = {
	  code: req.body.code,
	  redirect_uri: oauthproviders[req.params.application].options.redirect_url,
	  scope: oauthproviders[req.params.application].options.default_scope , // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
	};
	console.log(tokenConfig)
	// Save the access token
	try {
	    const accessToken = await oauthobject.getToken(req.body.code);
		console.log(accessToken)
		const accessTokenObject = {
			access_token: accessToken.token.access_token,
			expires_at: accessToken.token.expires_at,
			expires_in: accessToken.token.expires_in,
			refresh_token: accessToken.token.refresh_token,
			scope: accessToken.token.scope,
			token_type: accessToken.token.token_type
		}
		return res.send({success: true, data: accessTokenObject});

		/*
	    if(req.params.application !== undefined){
		const conditions = {where: {user: req.uid, name: req.params.application}};
		const body = {
		  user: req.uid, 
		  name: req.params.application, 
		  access_token: accessToken.token.access_token, 
		  refresh_token: accessToken.token.refresh_token,
		  expires_at: accessToken.token.expires_at,
		  token_type: accessToken.token.token_type,
		  scope: accessToken.token.scope, 
		};
		console.log(conditions, body)
		let entry = await db.apisettings.findOne(conditions)
		if(entry){
		    entry = await entry.update(body)
		}else{
		    entry = await db.apisettings.create(body);
		}
		return res.send(entry);
	    }
		return res.send(accessToken);
		*/
	}catch (error) {
	    console.log(error.message, error.output);
	    return res.status(400).send({success: false, message: error.message, output: error.output})
	}
}



exports.refresh = () => async (req, res) => {
	try{
		const oauthobject = oauthproviders[req.params.application];
		const accessToken = await oauthobject.refresh(req.body);
		const accessTokenObject = {
			access_token: accessToken.token.access_token,
			expires_at: accessToken.token.expires_at,
			expires_in: accessToken.token.expires_in,
			refresh_token: accessToken.token.refresh_token,
			scope: accessToken.token.scope,
			token_type: accessToken.token.token_type
		}
		return res.send({success: true, data: accessTokenObject});
	}catch(error){
		return res.status(400).send({success: false, message: error.message, output: error.output})
	}

}


