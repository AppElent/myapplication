const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;

const db = require('../config/db.config.js');
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const path = require("path");
require('dotenv').config();

const customStoreInstance = customStore(`${__dirname}${path.sep}storage.json`);

const BunqClient = new BunqJSClient(customStoreInstance);
console.log("hoevaak komt deze voorbij");


const setup = async () => {

	const defaultErrorLogger = error => {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	};

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

var userInfo = null;
setup().then(async BunqClient => {
	// get user info connected to this account
	const users = await BunqClient.getUsers(true);
	userInfo = users[Object.keys(users)[0]];	

	const accounts = await BunqClient.api.monetaryAccount.list(userInfo.id);
	console.log("\nAccounts: ", accounts.length);
}).catch(error => {
	if (error.response) {
		console.log(error.response.data);
	} else {
		console.log(error);
	}
});



exports.formatOAuthUrl = async (req, res) => {	
	let url = await BunqClient.formatOAuthAuthorizationRequestUrl(
		process.env.BUNQ_CLIENT_ID, 
		process.env.BUNQ_REDIRECT_URI, 
		process.env.BUNQ_STATE
	);   
	res.status(200).send(url);
};

exports.exchangeOAuthTokens = async (req, res) => {	
	if(req.query.code == null){
		res.send("Geen auth code meegegeven");
	}else{
		const authorizationCode = await BunqClient.exchangeOAuthToken(
			process.env.BUNQ_CLIENT_ID, 
			process.env.BUNQ_CLIENT_SECRET, 
			process.env.BUNQ_REDIRECT_URI,
			req.query.code,
			process.env.BUNQ_STATE
		)
		console.log("Key: " + authorizationCode);
		res.send("Code opgeslagen");
	}
};

exports.getMonetaryAccountByName = async (req, res) => {
	// get accounts list
	const accounts = await BunqClient.api.monetaryAccount.list(userInfo.id).catch(error => {
                throw error;
            });
	console.log("\nAccounts: ", accounts.length);

	res.send("ok");
}


