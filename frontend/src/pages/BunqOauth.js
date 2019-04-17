import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';

const BunqOauth = ({auth}) => {
    
    const [url, setUrl] = useState(null);
    
    const loadUrl = async () => {
        makeAPICall('/api/bunq/oauth/formatUrl', 'GET', null, await auth.getAccessToken()).then(data => setUrl(data));
    }
    
    useEffect(() => {
        loadUrl()
    }, [])
    
    
    return (<div><h1>Bunq Generate</h1>
        <Button variant="primary" href={url} disabled={url === null}>Get Key</Button>
        </div>
    );
} 

export default withAuth(BunqOauth)
