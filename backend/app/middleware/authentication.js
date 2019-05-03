
const OktaJwtVerifier = require('@okta/jwt-verifier');
const fetch = require("node-fetch");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-810647.okta.com/oauth2/default',
  clientId: process.env.OKTA_CLIENT_ID,
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


const checkAuthenticated = async (req, res, token = null, group = null) => {
	//Checken of er een custom token is
	//const token = "homebridge-authenticated"
	const authHeader = req.headers.authorization || '';
	//console.log(req.headers);
	const apimatch = authHeader.match(/Apitoken (.+)/);
	const remoteIP = req.socket.remoteAddress;
	if(!apimatch && token !== null) return {result: false, reason: 'No API token given'}
	if (apimatch && token) {
		const accessToken = apimatch[1];
		console.log(accessToken, token, remoteIP, remoteIP.endsWith('192.168.178.1'));
		const localaddress = (remoteIP.endsWith('192.168.178.1') ? true : false)
		if(localaddress === false) return {result: false, reason: 'No local address'}
		if(accessToken !== token) return {result: false, reason: 'Token doesnt match'}
		return {result: true, jwt: false}
		//return res.status(401).end();
	}
	
	
	
	const bearermatch = authHeader.match(/Bearer (.+)/);

	if (!bearermatch) return {result: false, reason: 'Bearer does not match'}
	
	const accessToken = bearermatch[1];
	try{
		const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken);
		try{
		    if(group !== null){
			const groupMember = await isMemberOfGroup(req, group);
			if(groupMember === false){
			  return {result: false, reason: 'Not member of specified group (' + group + ')'}
			}
		    }
		}catch(grouperror){
		    console.log(grouperror);
		    return {result: false, reason: 'Not member of specified group (' + group + ')'}
		}
		return {result: true, jwt: jwt}
	}catch(error){
		console.log(error);
		return {result: false, reason: 'Accesstoken incorrect'}
	}
	
	
}
/*
const checkUser = async (authid, id, scoped) => {
	if(id !== undefined){
		if(id !== authid){
			return {result: false, reason: 'Request for wrong user'}
		}
	}else{
		if(scoped === true){
			return {result: false, reason: 'Scoped=true and no user id given'}
		}else if (scoped === false){
			return {result: true, reason: 'Scoped=false, no user id given'}
		}
	}

	const user = await db.users.findByPk(authid);
	if(user === null){
		return {result: false, reason: 'User not found'}
	}
	
	if(Number.isInteger(scoped)){
		if(user.access_level < scoped){
			return {result: false, reason: 'Accesslevel not high enough'}
		}	
	}
	
	return {result: true, reason: ''}

}


//checkUser('abc').then(data => console.log(data))
//checkUser('00uaz3xmdoobfWWnY356').then(data => console.log(data))

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt

const requireAuthenticated = async (req, res, token = null, scoped = false, userparam = undefined) => {
  const authenticated = await checkAuthenticated(req, res, token);
  console.log('authenticated_result', authenticated.result, authenticated.reason, req.originalUrl);
  if(authenticated.result === false) return authenticated;
  if(authenticated.jwt === undefined) return authenticated;
  
  req.uid = authenticated.jwt.claims.uid;
  req.jwt = authenticated.jwt
  //const checkuser = await checkUser(req.uid, userparam, scoped);
  console.log('checkuser_result', checkuser.result, checkuser.reason, req.originalUrl);
  checkuser.jwt = authenticated.jwt;
  return checkuser;
  //return (checkuser === true ? true : 'User is niet goed');
}
* */


module.exports.epilogueAuthenticationRequired = async (req, res, context, token = null) => {
  const authenticated = await checkAuthenticated(req, res, token);
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


module.exports.authenticationRequired = (token = null, group = null) => (req, res, next) => {
    checkAuthenticated(req, res, token, group)
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
	  /*
  return function(req, res, next){
	  requireAuthenticated(req, res, token)
	  .then(authenticated => {
		  if(authenticated.result === true){
			  req.jwt = authenticated.jwt;
			  next();
		  }else{
			  return res.status(401).send(authenticated.reason);
		  }
	  })
  }
  * */
}
	

