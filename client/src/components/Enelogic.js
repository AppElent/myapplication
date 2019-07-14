// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import { Button } from 'react-bootstrap';
import {getLocalStorage} from '../utils/localstorage';

const Enelogic = ({auth}) => {
    
    const [enelogicSettings, setEnelogicSettings] = useState(getLocalStorage('enelogic') || {success: false})
    const [enelogicUrl, setEnelogicUrl] = useState('');
    
    const loadEnelogicUrl = async () => {
        const url = await makeAPICall('/api/enelogic/oauth/formaturl', 'GET', undefined, await auth.getAccessToken());
        setEnelogicUrl(url);
    }
    
    useEffect(() => {
        loadEnelogicUrl();
    }, [])
    
    return <div><h2>Enelogic</h2>
        <Button variant={enelogicSettings.success ? 'success' : 'primary'} href={enelogicUrl}>Configureer</Button>
    </div>  
        
}

export default withAuth(Enelogic)
