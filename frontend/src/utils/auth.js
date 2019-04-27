import { useState, useEffect } from 'react';
import {makeAPICall} from '../utils/fetching'

export const useAuth = auth => {
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    });
  });

  useEffect(() => {
    if (authenticated) {
      auth.getUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [authenticated]);

  return [authenticated, user];
};


export const exchangeOAuthToken = async (url, code, auth) => {
    const body = {code: code}
    const accesstoken = await makeAPICall(url, 'POST', body, await auth.getAccessToken()).catch(err => undefined)
    console.log(accesstoken);
    if(accesstoken !== undefined){
        const config = {
            success: true, 
            access_token: accesstoken.token.access_token, 
            expires_at: accesstoken.token.expires_at, 
            token_type: accesstoken.token.token_type, 
            scope: accesstoken.token.scope,
            refresh_token: accesstoken.token.refresh_token
        }
        console.log(config);
        return config;
    }
    return undefined;
}
