
module.exports = {
	providers: {},
	addProvider: (name, client_id, client_secret, options) => {
		console.log(123);
		providers[name] = {
			client_id, client_secret, options
		};
	},
	deleteProvider: (name) => {
		delete providers[name];
	}
}
