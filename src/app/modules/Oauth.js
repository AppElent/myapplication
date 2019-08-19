const SimpleOauth2 = require('simple-oauth2')

export default class Oauth {

  constructor(client_id, client_secret, options) {
    
    this.credentials = {
      client: {
        id: client_id,
        secret: client_secret
      },
      auth: {
      }
    }
    if(options.tokenHost) this.credentials.auth['tokenHost'] = options.tokenHost;
    if(options.idParamName) this.credentials.client['idParamName'] = options.idParamName;
    if(options.secretParamName) this.credentials.client['secretParamName'] = options.secretParamName;
    if(options.tokenPath) this.credentials.auth['tokenPath'] = options.tokenPath;
    if(options.authorizePath) this.credentials.auth['authorizePath'] = options.authorizePath;
    console.log(this.credentials);
    if(options.flow === 'authorization'){
      this.oauth = SimpleOauth2.create(this.credentials);
    }
    
    this.options = options;
  }

 
  formatUrl(redirect_host, state = null){
    const url = (redirect_host + this.options.redirect_url);
    const formatUrlOptions = {
      redirect_uri: url
    }
    if(this.options.default_scope) formatUrlOptions['scope'] = this.options.default_scope;
    if(state !== null) formatUrlOptions['state'] = state;
    const authorizationUri = this.oauth.authorizationCode.authorizeURL(formatUrlOptions);
    return (authorizationUri);
  }
  
  async getToken(redirect_host = null, code, state = null){
    // Get the access token object (the authorization code is given from the previous step).
    const url = (redirect_host + this.options.redirect_url);
    const tokenConfig = {
      code: code,
      redirect_uri: url
    };
    
    if(this.options.default_scope) tokenConfig['scope'] = this.options.default_scope;
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
        //console.log('refreshed', accessTokenObject);
        //await entry.update({access_token: accessTokenObject.token.access_token, refresh_token: accessTokenObject.token.refresh_token, expires_at: accessTokenObject.token.expires_at})
      } catch (error) {
        console.log('Error refreshing access token: ', error);
      }
    }
    return accessTokenObject;
  }
  
}