//

const fetch = require("node-fetch");



const okta_api_key = '00g7dIEQGecknyPoK0xGMTZp2wlvg74fFzIo7Qqv3o'

exports.createUser = async (req, res){
	
	const result = await fetch(process.env.OKTA_ORG_URL + '/api/v1/users?active=false', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'SSWS ' + okta_api_key
		},
		body: req.body
	})
	return result;
	
	/*
	 *     //create_user_token = 00g7dIEQGecknyPoK0xGMTZp2wlvg74fFzIo7Qqv3o
    curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://{yourOktaDomain}/api/v1/users?activate=false"
* */
}
