import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultFormRow from '../components/DefaultFormRow';

const DarkSky = ({auth}) => {
    const [config, setConfig] = useState(getLocalStorage('darksky') || {api_key: '', success: false});
    
    const saveConfig = async () => {
        const data = await makeAPICall('/api/darksky/current', 'GET', null, await auth.getAccessToken())
        //setData(data.hourly.data);
        setConfig({api_key: config.api_key, success: true})
    }
    
    useEffect(() => {
        setLocalStorage('darksky', config)
    }, [config])

   
    const configHandler = (event) => setConfig({...config, 'api_key': event.target.value});
    
    const buttonClickHandler = (event) => saveConfig()
    
    let formItems = [{
        name: 'apikey',
        type: 'input',
        label: 'API key',
        value: config.api_key,
        changehandler: configHandler
    }] 
    
    return <div><h2>DarkSky connection</h2>

        <DefaultFormRow data={formItems} buttons={[{id: 'saveapikey', click: buttonClickHandler, buttonclass: (config.success ? 'success' : 'danger'), disabled: false, text: 'Sla API key op'}]} />
        <p>Config correct: {config.success === true ? 'Ja' : 'Nee'} </p>
    </div>  
        
}

export default withAuth(DarkSky)
