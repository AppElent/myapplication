// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import { Button } from 'react-bootstrap';
import {getLocalStorage} from '../utils/localstorage';

const OAuthSetting = ({auth, title, formatUrl, lskey}) => {
    
    const [settings, setSettings] = useState(getLocalStorage(lskey) || {success: false})
    const [url, setUrl] = useState('');
    
    const loadUrl = async () => {
        const url = await makeAPICall(formatUrl, 'GET', undefined, await auth.getAccessToken());
        setUrl(url);
    }
    
    useEffect(() => {
        loadUrl();
    }, [])
    
    return <div><h2>{title}</h2>
        <Button variant={settings.success ? 'success' : 'primary'} href={url}>Configureer</Button>
    </div>  
        
}

export default withAuth(OAuthSetting)
