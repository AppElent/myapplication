const db = require('../models/index.js');
const router = require('express').Router();

const bunqstate = 'skjdhfkasjhbvckahsdjfhagdbjfhgmnfadnfbsmdafbe'

//const BunqWrapper = require('../modules/BunqWrapper')
//const bunq = new BunqWrapper();
//bunq.startup();

import {oauthproviders} from '../modules/application_cache';
import {bunq} from '../modules/Bunq';
import {encryption} from '../modules/Encryption';
import {basicAuthentication} from '../middleware/authentication';

const saveBunqSettings = async (user, authorizationCode, encryptionKey, environment = 'PRODUCTION') => {
	const conditions = {where: {userId: user}};
	const body = {
	  userId: user, 
	  access_token: authorizationCode, 
	  encryption_key: encryptionKey,
	  environment: environment
	};
	let entry = await db.bunq.findOne(conditions)
	if(entry){
		entry = await entry.update(body)
	}else{
		entry = await db.bunq.create(body);
	}
	return entry;
}

/*
exports.formatOAuthUrl = async (req, res) => {	
	let url = await bunq.getGenericClient().formatOAuthAuthorizationRequestUrl(
		process.env.BUNQ_CLIENT_ID, 
		'https://ericjansen.dynu.net/bunq/oauth', 
		bunqstate
	);   
	res.status(200).send(url);
};
*/

const exchangeOAuthTokens = async (req, res) => {	
	if(req.body.code === null){
		res.send("Geen auth code meegegeven");
	}else{
		try{
			const bunqoauth = oauthproviders['bunq'];
			const authorizationCode = await bunq.getGenericClient().exchangeOAuthToken(
				bunqoauth.options.client_id, 
				bunqoauth.options.client_secret, 
				bunqoauth.options.redirect_url,
				req.body.code
			) 
			console.log(authorizationCode);
			const entry = await saveBunqSettings(req.uid, authorizationCode, encryption.generateRandomKey(32), 'PRODUCTION');
			await bunq.load(req.uid, req.uid, authorizationCode, entry.encryption_key, {}); 
			return res.send({success: true});
		}catch(error){
			console.log(error);
			return res.send({success: false, message: error.response.data.error_description});
		}
	}
};

const doRequestSandboxMoney = async (uid) => {
	const client = bunq.getClient(uid);
	if(client.environment !== 'SANDBOX') throw new Error('You can only request money on a sandbox environment. Bunq environment is: ' + client.environment)
	let accounts = await client.getAccounts();
	const request1 = await client.createRequestInquiry({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}, {
			"type": "EMAIL",
			"value": "sugardaddy@bunq.com",
			"name": "Sugar Daddy"
		})
	const request2 = await client.createRequestInquiry({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}, {
			"type": "EMAIL",
			"value": "sugardaddy@bunq.com",
			"name": "Sugar Daddy"
		})
	const request3 = await client.createRequestInquiry({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}, {
			"type": "EMAIL",
			"value": "sugardaddy@bunq.com",
			"name": "Sugar Daddy"
		})
}

const createSandboxAPIKey = async (req, res) => {
	const key = await bunq.getGenericClient().api.sandboxUser.post();
	const userentry = await saveBunqSettings(req.uid, key, encryption.generateRandomKey(32), 'SANDBOX');
	console.log(userentry);
	await bunq.load(req.uid, req.uid, key, userentry.encryption_key, {env: 'SANDBOX'});
	const client = bunq.getClient(req.uid);
	const users = await client.getUser();
	try{
		await doRequestSandboxMoney(req.uid);
	}catch(err){
		return res.status(400).send({success: false, message: err});
	}
	return res.send({success: true, data: {users}});
}

const requestSandboxMoney = async (req, res) => {
	try{
		await doRequestSandboxMoney(req.uid);
	}catch(err){
		return res.status(400).send({success: false, message: err});
	}
	return res.send({success: true});
}



const getMonetaryAccounts = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	console.log('forceUpdate', forceUpdate)
	const data = await bunqClient.getAccounts(forceUpdate);
	return res.send({data: data, success: true});
}

const getMonetaryAccountByName = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const result = accounts.find(account => account.description === req.params.name)
	if(result === null) return res.status(404).send({})
	res.send(result)
}

const getEvents = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	const events = await bunqClient.getEvents(forceUpdate);
	return res.send(events);
}

const postPaymentInternal = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makePaymentInternal(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}

const postDraftPayment = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makeDraftPayment(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}



const getCards = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	return res.send(await bunqClient.getBunqJSClient().api.card.list(bunqClient.getUser().id));
}

const test = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const request = await bunqClient.createBunqMeTab({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}).catch(err => {console.log(err)});
	return res.send(request);
}


router.post('/oauth/exchange', basicAuthentication, exchangeOAuthTokens);
router.get('/accounts', basicAuthentication, getMonetaryAccounts);
router.get('/accounts/:name', basicAuthentication, getMonetaryAccountByName);
router.get('/accounts', basicAuthentication, getMonetaryAccounts);
router.post('/payment', basicAuthentication, postPaymentInternal);
router.get('/events', basicAuthentication, getEvents);
router.post('/draftpayment', basicAuthentication, postDraftPayment);
router.get('/cards', basicAuthentication, getCards)
router.get('/sandbox', basicAuthentication, createSandboxAPIKey);
router.get('/sandbox/request', basicAuthentication, requestSandboxMoney);
router.get('/test', basicAuthentication, test);


module.exports = router;