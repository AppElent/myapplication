const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;

const db = require('../config/db.config.js');
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const path = require("path");
require('dotenv').config();

//console.log('pad', path.resolve(__dirname, "../bunq/storage.json"))
//const customStoreInstance = customStore(`${__dirname}${path.sep}storage.json`);
const customStoreInstance = customStore(path.resolve(__dirname, "../bunq/storage.json"));

const BunqClient = new BunqJSClient(customStoreInstance);

const BunqWrapper = require('../classes/BunqWrapper')
const bunq = new BunqWrapper();
bunq.startup();

/*
const test = async () => {
	let test = await db.apisettings.findOne({where: {name: 'bunq', user: '00uh1btgtpVNlyc4k356'}})
	const bunqClientWrapper = await bunq.installNewClient(test);
	const users = await bunqClientWrapper.getBunqJSClient().getUsers(true).catch(defaultErrorLogger);
}
test()


const getObject = object => {
    const objectKeys = Object.keys(object);
    const objectKey = objectKeys[0];

    return object[objectKey];
};

const defaultErrorLogger = error => {
	if (error.response) {
		throw error.response.data;
	}
	throw error;
};

const setup = async () => {
	// load and refresh bunq client
	await BunqClient.run(process.env.BUNQ_OAUTH_API_KEY, [], 'PRODUCTION', process.env.BUNQ_ENCRYPTION_KEY).catch(
		exception => {
			throw exception;
		}
	);

	// disable keep-alive since the server will stay online without the need for a constant active session
	BunqClient.setKeepAlive(false);

	// create/re-use a system installation
	await BunqClient.install().catch(defaultErrorLogger);

	// create/re-use a device installation
	await BunqClient.registerDevice(process.env.BUNQ_DEVICE_NAME).catch(defaultErrorLogger);

	// create/re-use a bunq session installation
	await BunqClient.registerSession().catch(defaultErrorLogger);
	
	
	return BunqClient;
}

let userInfo = null;
let accounts = null;
let activeAccounts = null;

async function setAccounts(){
	accounts = await BunqClient.api.monetaryAccount.list(userInfo.id).catch(defaultErrorLogger);
	activeAccounts = accounts.filter(account => {
		if (account.MonetaryAccountBank) {
			return account.MonetaryAccountBank.status === "ACTIVE";
		}
		if (account.MonetaryAccountJoint) {
			return account.MonetaryAccountJoint.status === "ACTIVE";
		}
		if (account.MonetaryAccountSavings) {
			return account.MonetaryAccountSavings.status === "ACTIVE";
		}
		return false;
	});	
}

setup().then(async BunqClient => {
	// get user info connected to this account
	const users = await BunqClient.getUsers(true).catch(defaultErrorLogger);
	userInfo = users[Object.keys(users)[0]];	

	//await setAccounts();
	//console.log("\nAccounts: ", accounts.length);
}).catch(error => {
	if (error.response) {
		console.log(error.response.data);
	} else {
		console.log(error);
	}
});

*/

exports.formatOAuthUrl = async (req, res) => {	
	let url = await BunqClient.formatOAuthAuthorizationRequestUrl(
		process.env.BUNQ_CLIENT_ID, 
		process.env.BUNQ_REDIRECT_URI, 
		process.env.BUNQ_STATE
	);   
	res.status(200).send(url);
};

exports.exchangeOAuthTokens = async (req, res) => {	
	if(req.body.code === null){
		res.send("Geen auth code meegegeven");
	}else{
		const authorizationCode = await BunqClient.exchangeOAuthToken(
			process.env.BUNQ_CLIENT_ID, 
			process.env.BUNQ_CLIENT_SECRET, 
			process.env.BUNQ_REDIRECT_URI,
			req.body.code,
			process.env.BUNQ_STATE
		) 
		console.log("Key: " + authorizationCode);
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
		await bunq.installNewClient(entry);
		return res.send(entry);
	}
};



exports.getMonetaryAccounts = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	return res.send(await bunqClient.getAccounts());
}

exports.getMonetaryAccountByName = async (req, res) => {
	const bunqClient = bunq.getClient(req.uid);
	const accounts = await bunqClient.getAccounts();
	const result = accounts.find(account => account.description === req.params.name)
	if(result === null) return res.status(404).send({})
	res.send(result)
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
	return res.send(await bunq.createSandboxAPIKey());
}

/*
async function getActiveMonetaryAccountByName(name){
	for (var activeAccount of activeAccounts){
		if(getObject(activeAccount)["description"] == name){
			//console.log("gevonden", activeAccount);
			return (getObject(activeAccount));
		}
	}
	return null;
}


function getAliasByType(account, type){
	const aliasses = account.alias;
	return aliasses.find(alias => {return alias.type === type})
}

async function makePaymentInternal(from, to, description, amount) {
    const from_account = await getActiveMonetaryAccountByName(from).catch(defaultErrorLogger);
    const to_account = await getActiveMonetaryAccountByName(to).catch(defaultErrorLogger);
    if (from_account == null) {
        console.log ("Van account bestaat niet: " + from);
        return;
    }
    if (to_account == null) {
        console.log ("To account bestaat niet: " + to);
        return;
    }
    
    const counterpartyAlias = getAliasByType(to_account, "IBAN");
    const paymentResponse = await BunqClient.api.payment.post(
        userInfo.id,
        from_account.id,
        description,
        { value: amount, currency: "EUR" },
        counterpartyAlias
    ).catch(defaultErrorLogger);
    
    // iets met paymentResponse doen hier

    return paymentResponse;
}
* */
