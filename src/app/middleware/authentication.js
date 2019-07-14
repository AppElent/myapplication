
const OktaJwtVerifier = require('@okta/jwt-verifier');
const fetch = require("node-fetch");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-810647.okta.com/oauth2/default',
  clientId: '0oabepfc2Yo0a3Q0H356',
  assertClaims: {
	aud: 'api://default',
  },
});

const isMemberOfGroup = async (req, group) => {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    const result = await fetch(baseUrl + '/api/okta/groups', {
	    method: 'GET',
	    headers: req.headers
    }).catch(err => console.log(err))
    const data = await result.json();
    for(var oktagroup of data) {
      console.log('Groep ' + oktagroup.profile.name + ' wordt gecheckt tegen ' + group);
      if(oktagroup.profile.name === group) return true;
    }
    return false;
}


const checkAuthenticated = async (req, res, options = {}) => {
	//Checken of er een custom token is
	//const token = "homebridge-authenticated"
	const authHeader = req.headers.authorization || '';
	//console.log(req.headers);
	const apimatch = authHeader.match(/Apitoken (.+)/);
	const remoteIP = req.socket.remoteAddress;
	if(!apimatch && options.token !== undefined) return {result: false, reason: 'No API token given'}
	if (apimatch && options.token) {
		const accessToken = apimatch[1];
		console.log(accessToken, token, remoteIP, remoteIP.endsWith('192.168.178.1'));
		const localaddress = (remoteIP.endsWith('192.168.178.1') ? true : false)
		if(localaddress === false) return {result: false, reason: 'No local address'}
		if(accessToken !== token) return {result: false, reason: 'Token doesnt match'}
		return {result: true, jwt: false}
		//return res.status(401).end();
	}
	
	
	
	const bearermatch = authHeader.match(/Bearer (.+)/);
	if (!bearermatch && process.env.ENV === 'DEV') {
	  console.log('Authentication passed, env=DEV');
	  return {result: true, jwt: {claims: {uid: '00uh1btgtpVNlyc4k356'}}}
	}
	if (!bearermatch) return {result: false, reason: 'Bearer does not match'}
	
	const accessToken = bearermatch[1];
	try{
		const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
		try{
		    if(options.group !== undefined){
			const groupMember = await isMemberOfGroup(req, options.group);
			if(groupMember === false){
			  return {result: false, reason: 'Not member of specified group (' + options.group + ')'}
			}
		    }
		}catch(grouperror){
		    console.log(grouperror);
		    return {result: false, reason: 'Not member of specified group (' + options.group + ')'}
		}
		return {result: true, jwt: jwt}
	}catch(error){
		console.log(error);
		return {result: false, reason: 'Accesstoken incorrect'}
	}
	
	
}

module.exports.epilogueAuthenticationRequired = async (req, res, context, options) => {
    const authenticated = await checkAuthenticated(req, res, options);
    console.log('Authentication result ' + authenticated.result);
    if(authenticated.result === true){
	    req.jwt = authenticated.jwt;
	    if(authenticated.jwt !== false){
	      req.uid = req.jwt.claims.uid;
	    }
	    
	    return context.continue;
    }
    console.log("Error = " + authenticated.reason);
    return context.stop;
}


module.exports.authenticationRequired = (options) => (req, res, next) => {
    checkAuthenticated(req, res, options)
    .then(authenticated => {
	    console.log('Authentication result ' + authenticated.result);
	    if(authenticated.result === true){
		    req.jwt = authenticated.jwt;
		    if(authenticated.jwt !== false){
			console.log('User ' + req.jwt.claims.uid + ' successfully authenticated');
			req.uid = req.jwt.claims.uid;
		    }
		    next();
	    }else{
		    return res.status(401).send(authenticated.reason);
	    }
    })
}
	

