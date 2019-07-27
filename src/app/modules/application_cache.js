const data = {
	oauthproviders: {},
	bunqclients: {}
}

export const oauthproviders = {}
export const bunqclients = {}

export const setData = (module, key, data) => {
	data[module] = {};
	data[module][key] = data;
}

export default data;
