import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
//import { Button } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {fetchBackend} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import {setLocalUserStorage} from '../utils/localstorage';
import {useFetch} from '../hooks/useFetch';

const queryString = require('query-string');

const OAuth = ({auth, url, redirectUrl, name}) => {
    
    const [success, setSuccess] = useState(null);
    
    const exchangeToken = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed)
        
        if(parsed.code !== undefined){
            const body = {code: parsed.code}
            console.log(body);
            const accesstoken = await fetchBackend(url, {method: 'POST', body, auth}).catch(err => {setSuccess(false)});
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
        <p>Succesvol: {success === null ? 'Loading. Deze pagina niet afsluiten' : (success ? 'Ja' : 'Nee' )}</p><Button href={redirectUrl}>Ga terug</Button>
    </div>
    );
} 

export default withAuth(OAuth)


