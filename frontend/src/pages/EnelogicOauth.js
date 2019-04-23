import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import {setLocalStorage} from '../utils/localstorage';
import { useAuth, exchangeOAuthToken } from '../utils/auth';

const queryString = require('query-string');

const EnelogicOauth = ({auth}) => {
    
    let gelukt = false;
    
    const exchangeToken = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed)
        
        if(parsed.code !== undefined){
            const accesstoken = exchangeOAuthToken('/api/enelogic/oauth/exchange');
            if(accesstoken !== undefined){
                setLocalStorage('enelogic', accesstoken);
            }
        }
    }
    
    useEffect(() => {
        exchangeToken()
    }, [])

    return (<div><h1>Enelogic Oauth</h1>
        <p>Succesvol: {gelukt ? 'Ja' : 'Nee'}</p>
    </div>
    );
} 

export default withAuth(EnelogicOauth)
