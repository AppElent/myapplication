const data = {
	oauthproviders: {}
}

export const setData = (module, key, data) => {
	data[module] = {};
	data[module][key] = data;
}

export default data;
