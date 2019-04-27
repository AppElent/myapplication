import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import {setLocalUserStorage} from '../utils/localstorage';
import { useAuth, exchangeOAuthToken } from '../utils/auth';

const queryString = require('query-string');

const OAuth = ({auth, lskey, url}) => {
    
    const [success, setSuccess] = useState(false)
    
    const exchangeToken = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed)
        
        if(parsed.code !== undefined){
            const accesstoken = await exchangeOAuthToken(url, parsed.code, auth);
            console.log(accesstoken);
            if(accesstoken !== undefined){
                const userid = (await auth.getUser()).sub
                accesstoken['success'] = true;
                console.log(userid, lskey, accesstoken);
                setLocalUserStorage(userid, lskey, accesstoken);
                setSuccess(true);
            }
        }
    }
    
    useEffect(() => {
        exchangeToken()
    }, [])

    return (<div><h1>OAuth 2.0</h1>
        <p>Succesvol: {success ? 'Ja' : 'Nee'}</p>
    </div>
    );
} 

export default withAuth(OAuth)
