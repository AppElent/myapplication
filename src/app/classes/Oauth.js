const SimpleOauth2 = require('simple-oauth2')

export default class Oauth {

  constructor(client_id, client_secret, options) {
    const credentials = {
      client: {
        id: client_id,
        secret: client_secret
      },
      auth: {
        tokenHost: options.tokenHost,
        tokenPath: options.tokenPath,
        authorizePath: options.authorizePath,
      }
      
    };
    this.oauth = SimpleOauth2.create(credentials);
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.options = options;
  }
  
  formatUrl(){
    // Authorization oauth2 URI
    const authorizationUri = this.oauth.authorizationCode.authorizeURL({
      redirect_uri: this.options.redirect_url,
      scope: this.options.default_scope
    });

    return (authorizationUri);
  }
  
  async exchange(code){
    // Get the access token object (the authorization code is given from the previous step).
    const tokenConfig = {
      code: code,
      redirect_uri: this.options.redirect_url,
      scope: this.options.default_scope , // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
    };
    console.log(tokenConfig)
    // Save the access token
    try {
        const result = await this.oauth.authorizationCode.getToken(tokenConfig)
        console.log(result);
        const accessToken = this.oauth.accessToken.create(result);
        return accessToken;
    }catch (error) {
        console.log(error);
        return {success: false, message: error}
    }
  }
  
  async refresh(accessToken){
    const tokenObject = {access_token: accessToken.access_token, refresh_token: accessToken.refresh_token, expires_at: accessToken.expires_at}
    let accessTokenObject = this.oauth.accessToken.create(tokenObject)
    
    // Check if the token is expired. If expired it is refreshed.
    if (accessTokenObject.expired()) {
      console.log('expired', accessTokenObject);
      try {
        accessTokenObject = await accessTokenObject.refresh();
        console.log('refreshed', accessTokenObject);
        //await entry.update({access_token: accessTokenObject.token.access_token, refresh_token: accessTokenObject.token.refresh_token, expires_at: accessTokenObject.token.expires_at})
      } catch (error) {
        console.log('Error refreshing access token: ', error.message);
      }
    }
    return accessTokenObject;
  }
  
}



