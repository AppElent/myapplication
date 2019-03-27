

exports.retrieveAccessTokenObject = async (credentials, store, name) => {
//async function retrieveAccessTokenObject(accessTokenString){
	const accessTokenString = store.get(name);
	if(accessToken !== undefined && accessTokenString.token !== undefined){
		const tokenObject = {
			access_token: accessTokenString.token.access_token, 
			expires_at: accessTokenString.token.expires_at, 
			"token_type": accessTokenString.token.token_type, 
			"scope": accessTokenString.token.scope, 
			"refresh_token": accessTokenString.token.refresh_token, 
		}
		//console.log("Tokenobject", tokenObject);

		var accessToken = credentials.accessToken.create(tokenObject);
		
		if(accessToken !== null){
			if (accessToken.expired()) {
				try {
					accessToken =  await accessToken.refresh();
					console.log("Accesstoken vernieuwd", accessToken.token.access_token);
					//enelogic_store.set('enelogic', accessToken);
				} catch (error) {
					//console.log('Error refreshing access token: ', error.message);
				}
			}else{
				//console.log("Accesstoken van enelogic is niet verlopen", accessToken);
			}
			store.set(name, accessToken);
		}
	}else{return undefined;}
	return accessToken;
}

exports.createPasswordTokenObject = async (oauthObject, tokenConfig) => {
	// Save the access token
	try {
	  const result = await oauthObject.ownerPassword.getToken(tokenConfig);
	  const accessToken = oauthObject.accessToken.create(result);
	} catch (error) {
	  console.log('Access Token Error', error.message);
	  return undefined;
	}
	return accessToken;
}
