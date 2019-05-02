import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import {setLocalUserStorage} from '../utils/localstorage';
import { useAuth } from '../utils/auth';

const queryString = require('query-string');

const OAuth = ({auth, url, redirectUrl}) => {
    
    const [success, setSuccess] = useState(false)
    
    const exchangeToken = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed)
        
        if(parsed.code !== undefined){
            const body = {code: parsed.code}
            const accesstoken = await makeAPICall(url, 'POST', body, await auth.getAccessToken()).catch(err => undefined);
            //if(accesstoken !== undefined){}
            //const accesstoken = null;//await exchangeOAuthToken(url, parsed.code, auth);
            console.log(accesstoken);
            if(accesstoken !== undefined){
                /*
                const config = {
                    success: true, 
                    access_token: accesstoken.token.access_token, 
                    expires_at: accesstoken.token.expires_at, 
                    token_type: accesstoken.token.token_type, 
                    scope: accesstoken.token.scope,
                    refresh_token: accesstoken.token.refresh_token
                }
                
                const userid = (await auth.getUser()).sub
                accesstoken['success'] = true;
                console.log(userid, lskey, accesstoken);
                setLocalUserStorage(userid, lskey, accesstoken);
                * */
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


