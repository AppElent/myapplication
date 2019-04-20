//

const fetch = require("node-fetch");



const okta_api_key = '00g7dIEQGecknyPoK0xGMTZp2wlvg74fFzIo7Qqv3o';

exports.createUser = async (req, res) => {

	const result = await fetch(process.env.OKTA_ORG_URL + '/api/v1/users?activate=false', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'SSWS ' + okta_api_key
		},
		body: JSON.stringify(req.body)
	}).catch(err => console.log(err))
	const data = await result.json();
	res.send(data)

}
