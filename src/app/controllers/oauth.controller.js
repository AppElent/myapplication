

import {oauthproviders} from '../modules/application_cache';
import fetch from 'node-fetch';
import moment from 'moment';
import asyncHandler from 'express-async-handler';
import { basicAuthentication } from '../middleware/authentication';
import cache from '../middleware/cacheMiddleware';
import Cache from '../modules/Cache';
const oauthCache = new Cache();

const router = require('express').Router();

const formatUrl = (req, res) => {
	const oauthobject = oauthproviders[req.params.application];
	console.log(999, oauthobject);
	// Authorization oauth2 URI
	//const protocol = (req.params.application.toLowerCase() === 'bunq' ? 'https' : req.protocol);
	//const redirecthost = protocol + '://' + req.get('host');
	const authorizationUri = oauthobject.formatUrl();

	// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
	return res.send(authorizationUri);
}

const exchange = async (req, res) => {
	const oauthobject = oauthproviders[req.params.application];
	
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
	}catch (error) {
	    console.log(error.message, error.output);
	    return res.status(400).send({success: false, message: error.message, output: error.output})
	}
}



const refresh = async (req, res) => {
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

router.get('/formatUrl/:application', basicAuthentication, cache(oauthCache), asyncHandler(formatUrl));
router.get('/exchange/:application', basicAuthentication, asyncHandler(exchange));
router.get('/refresh/:application', basicAuthentication, asyncHandler(refresh));

module.exports = router;
