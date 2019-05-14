import React, { useContext } from 'react';
import { withAuth } from '@okta/okta-react';
import { AuthContext } from '../context/AuthContext';

const Home = ({auth}) => {
    const { authenticated, setAuthenticated, admin, setAdmin } = useContext(AuthContext);
    
    const login = async () => {
        auth.login('/');
        setAuthenticated(true);
    }

    const logout = async () => {
        auth.logout('/');
        setAuthenticated(false);
    }
    
    if (authenticated === null) return null;
    const button = authenticated ?
      <button onClick={logout}>Logout</button> :
      <button onClick={login}>Login</button>;        
    
    return (<div><h1>Home Page</h1>{button}</div>);
};

export default withAuth(Home)
