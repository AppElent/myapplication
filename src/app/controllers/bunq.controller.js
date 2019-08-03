const db = require('../models/index.js');

const bunqstate = 'skjdhfkasjhbvckahsdjfhagdbjfhgmnfadnfbsmdafbe'

const BunqWrapper = require('../modules/BunqWrapper')
const bunq = new BunqWrapper();
bunq.startup();

const saveBunqSettings = async (user, authorizationCode, environment = 'PRODUCTION') => {
	const conditions = {where: {user: user, name: 'bunq'}};
	const body = {
	  user: user, 
	  name: 'bunq', 
	  access_token: authorizationCode, 
	};
	let entry = await db.apisettings.findOne(conditions)
	if(entry){
		entry = await entry.update(body)
	}else{
		entry = await db.apisettings.create(body);
	}
	return entry;
}

exports.formatOAuthUrl = async (req, res) => {	
	let url = await bunq.getGenericClient().formatOAuthAuthorizationRequestUrl(
		process.env.BUNQ_CLIENT_ID, 
		'https://ericjansen.dynu.net/bunq/oauth', 
		bunqstate
	);   
	res.status(200).send(url);
};

exports.exchangeOAuthTokens = async (req, res) => {	
	if(req.body.code === null){
		res.send("Geen auth code meegegeven");
	}else{
		const authorizationCode = await bunq.getGenericClient().exchangeOAuthToken(
			process.env.BUNQ_CLIENT_ID, 
			process.env.BUNQ_CLIENT_SECRET, 
			'https://ericjansen.dynu.net/bunq/oauth',
			req.body.code,
			bunqstate
		) 
		console.log("Key: " + authorizationCode);
		const entry = await saveBunqSettings(req.uid, authorizationCode, 'PRODUCTION');
		/*
		const conditions = {where: {user: req.uid, name: 'bunq'}};
		const body = {
		  user: req.uid, 
		  name: 'bunq', 
		  access_token: authorizationCode, 
		};
		let entry = await db.apisettings.findOne(conditions)
		if(entry){
		    entry = await entry.update(body)
		}else{
		    entry = await db.apisettings.create(body);
		}
		* */
		await bunq.installNewClient(entry);
		return res.send(entry);
	}
};



exports.getMonetaryAccounts = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	console.log('forceUpdate', forceUpdate)
	return res.send(await bunqClient.getAccounts(forceUpdate));
}

exports.getMonetaryAccountByName = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const result = accounts.find(account => account.description === req.params.name)
	if(result === null) return res.status(404).send({})
	res.send(result)
}

exports.getEvents = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const forceUpdate = (req.query.forceupdate !== undefined ? true : false) 
	const events = await bunqClient.getEvents(forceUpdate);
	return res.send(events);
}

exports.postPaymentInternal = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makePaymentInternal(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}

exports.postDraftPayment = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const payment = await bunqClient.makeDraftPayment(req.body.from, req.body.to, req.body.description, req.body.amount);
	res.send(payment);
}

exports.createSandboxAPIKey = async (req, res) => {
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

exports.getCards = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	return res.send(await bunqClient.getBunqJSClient().api.card.list(bunqClient.getUser().id));
}

exports.test = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const request = await bunqClient.createBunqMeTab({type: 'id', value: accounts[0].id}, 'Gimme money', {value: '500', currency: 'EUR'}).catch(err => {console.log(err)});
	return res.send(request);
}
