import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import {setLocalUserStorage} from '../utils/localstorage';

const queryString = require('query-string');

const OAuth = ({auth, url, redirectUrl}) => {
    
    const [success, setSuccess] = useState(false)
    
    const exchangeToken = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed)
        
        if(parsed.code !== undefined){
            const body = {code: parsed.code}
            const accesstoken = await makeAPICall(url, 'POST', body, await auth.getAccessToken()).catch(err => {setSuccess(false)});
            console.log(accesstoken);
            if(accesstoken !== undefined){
                setSuccess(true);
            }
        }
    }
    
    useEffect(() => {
        exchangeToken() 
    }, [])

    return (<div><h1>OAuth 2.0</h1>
        <p>Succesvol: {success ? 'Ja' : 'Nee'}</p><Button href={redirectUrl}>Ga terug</Button>
    </div>
    );
} 

export default withAuth(OAuth)


