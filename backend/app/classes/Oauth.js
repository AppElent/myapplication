const SimpleOauth2 = require('simple-oauth2')

module.exports = class Oauth {

  constructor() {
    this.oauth_providers = {}
  }
  
  loadProviders(){
    
  }

  formatUrl(key){
    const oauthobject = this.oauth_providers[key].object;
    // Authorization oauth2 URI
    const authorizationUri = oauthobject.authorizationCode.authorizeURL({
      redirect_uri: oauth_credentials[key].redirect_uri,
      scope: oauth_credentials[key].scope 
    });

    // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
    return (authorizationUri);
  }
  
  exchange(){
    
  }
  
  refresh(){
    
  }
  
}

