//

const fetch = require("node-fetch");



const okta_api_key = process.env.OKTA_API_KEY;


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

exports.getGroups = async (req, res) => {
	if(req.jwt === undefined) return res.status(401).send('Not authorized');
	const result = await fetch(process.env.OKTA_ORG_URL + '/api/v1/users/' + req.uid + '/groups', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'SSWS ' + okta_api_key
		}
	}).catch(err => console.log(err))
	const data = await result.json();
	res.send(data)
}
