// RootContext.js
import React, { useEffect, useState, createContext } from 'react';
import { withAuth } from '@okta/okta-react';
import {fetchBackend} from '../utils/fetching';

export const AuthContext = createContext();


const AuthController = ({auth, children}) => {
//class AuthController extends Component {
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [sub, setSub] = useState(null);
  
  console.log('Context loopt', auth.isAuthenticated());
  
  const loadAuthentication = async () => {
    let checkauthenticated = await auth.isAuthenticated();
    let user = null;
    let sub = null;
    let found = null;
    if(authenticated !== checkauthenticated) setAuthenticated(checkauthenticated);
    
    if(checkauthenticated){
	const userObj = await auth.getUser();
        setUser(userObj);
        setSub(userObj.sub);
        const groups = await fetchBackend('/api/okta/groups', 'GET', null, auth)
        found = groups.find((element) => {
          return element.profile.name === 'Admins'; 
        }); 
        setAdmin(found !== null);
        console.log(groups, found);
    }

  }
  
  useEffect(() => {
    loadAuthentication();
  }, [authenticated]);
  
  const defaultContext = {
    authenticated,
    setAuthenticated,
    admin,
    setAdmin,
    user,
    setUser,
    sub,
    setSub
  };
	return (
	  <AuthContext.Provider value={defaultContext}>
		{children}
	  </AuthContext.Provider>
	);

}

export const AuthProvider = withAuth(AuthController);
