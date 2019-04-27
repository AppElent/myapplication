import { useState, useEffect } from 'react';

export const useAuth = auth => {
  const [object, setObject] = useState({authenticated: null, user: null, sub: null});
  
  console.log("useAuth hook loopt");
  
  const loadAuthentication = async () => {
    let authenticated = await auth.isAuthenticated();
    let user = null;
    let sub = null;
    if(authenticated){
        user = await auth.getUser();
    }
    setObject({...object, authenticated: authenticated, user: user, sub: (user !== null ? user.sub : '')});
  }
  
  useEffect(() => {
    loadAuthentication();
  }, []);

  return [object.authenticated, object.user, object.sub];
};

export default useAuth;
