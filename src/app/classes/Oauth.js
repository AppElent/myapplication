const SimpleOauth2 = require('simple-oauth2')
const db = require('../config/db.config.js');

module.exports = class Oauth {

  constructor(dbsettings = null) {
    this.settings = dbsettings;
    this.oauth;
    
    if(dbsettings !== null){
      this.load(dbsettings);
    }
  }
  
  load(settings){
    const credentials = {
      client: {
        id: settings.client_id,
        secret: settings.client_secret
      },
      auth: {
        tokenHost: settings.tokenHost,
        tokenPath: settings.tokenPath,
        authorizePath: settings.authorizePath,
      }
      
    };
    this.oauth = SimpleOauth2.create(credentials);
  }
  
  async loadById(key){
    const setting = await db.oauthproviders.findOne({where: {id: key}});
    if(setting === null) return false;
    this.load(setting);
    return;
  }
  
  getSettings(){
    return this.oauth;
  }
 

  formatUrl(){
    // Authorization oauth2 URI
    const authorizationUri = this.oauth.authorizationCode.authorizeURL({
      redirect_uri: this.settings.redirect_url,
      scope: this.settings.default_scope
    });

    return (authorizationUri);
  }
  
  async exchange(code){
    const oauthobject = oauth_credentials[req.params.application].object;
    
    // Get the access token object (the authorization code is given from the previous step).
    const tokenConfig = {
      code: code,
      redirect_uri: this.settings.redirect_url,
      scope: this.settings.default_scope , // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
    };
    console.log(tokenConfig)
    // Save the access token
    try {
        const result = await this.object.authorizationCode.getToken(tokenConfig)
        console.log(result);
        const accessToken = this.object.accessToken.create(result);
        return accessToken;
    }catch (error) {
        console.log(error);
        return {success: false, message: error}
    }
  }
  
  async refresh(entry){
    const tokenObject = {access_token: entry.access_token, refresh_token: entry.refresh_token, expires_at: entry.expires_at}
    let accessTokenObject = this.oauth.accessToken.create(tokenObject)
    
    // Check if the token is expired. If expired it is refreshed.
    if (accessTokenObject.expired()) {
      console.log('expired', accessTokenObject);
      try {
        accessTokenObject = await accessTokenObject.refresh();
        console.log('refreshed', accessTokenObject);
        
        await entry.update({access_token: accessTokenObject.token.access_token, refresh_token: accessTokenObject.token.refresh_token, expires_at: accessTokenObject.token.expires_at})
      } catch (error) {
        console.log('Error refreshing access token: ', error.message);
      }
    }
  }
  
}

