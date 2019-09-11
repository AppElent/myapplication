const db = require('../models/index.js');

const bunqstate = 'skjdhfkasjhbvckahsdjfhagdbjfhgmnfadnfbsmdafbe'

//const BunqWrapper = require('../modules/BunqWrapper')
//const bunq = new BunqWrapper();
//bunq.startup();

import {oauthproviders} from '../modules/application_cache';
import {bunq} from '../modules/Bunq';
import {encryption} from '../modules/Encryption';

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

export const exchangeOAuthTokens = async (req, res) => {	
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



export const getMonetaryAccounts = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	console.log('forceUpdate', forceUpdate)
	const data = await bunqClient.getAccounts(forceUpdate);
	return res.send({data: data, success: true});
}

export const getMonetaryAccountByName = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const result = accounts.find(account => account.description === req.params.name)
	if(result === null) return res.status(404).send({})
	res.send(result)
}

export const getEvents = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	const events = await bunqClient.getEvents(forceUpdate);
	return res.send(events);
}

export const postPaymentInternal = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makePaymentInternal(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}

export const postDraftPayment = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makeDraftPayment(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}

export const createSandboxAPIKey = async (req, res) => {
	const key = await bunq.getGenericClient().api.sandboxUser.post();
	if(req.query.install !== undefined && req.query.install.toUpperCase() === 'TRUE') {
		const userentry = await saveBunqSettings(req.uid, key, 'SANDBOX');
		const client = await bunq.installNewClient(userentry);
		const users = await client.getUser();
		const accounts = await client.getAccounts();
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
		const accounts2 = await client.getAccounts(true);
		return res.send({users: users, request: request1, accounts: accounts2});
	}
	return res.send(key);
}

export const getCards = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	return res.send(await bunqClient.getBunqJSClient().api.card.list(bunqClient.getUser().id));
}

export const test = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const request = await bunqClient.createBunqMeTab({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}).catch(err => {console.log(err)});
	return res.send(request);
}
