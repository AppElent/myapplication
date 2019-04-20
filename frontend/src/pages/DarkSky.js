import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall, makeAPICallFromNodeJS} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

const DarkSky = ({auth}) => {
    const [data, setData] = useState([]);
    const [config, setConfig] = useState(getLocalStorage('darksky') || {api_key: '', success: false});
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState('');
    
    const saveConfig = async () => {
        const data = await makeAPICall('/api/darksky/current', 'GET', null, await auth.getAccessToken())
        setData(data.hourly.data);
        setConfig({api_key: config.api_key, success: true})
    }
    
    useEffect(() => {
        setLocalStorage('darksky', config)
    }, [config])

    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'time', // String-based value accessors!
        Cell: props => <Moment date={props.value*1000} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'Temperatuur',
        accessor: 'temperature',
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }]  
    
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

        <DefaultFormRow data={formItems} buttons={[{id: 'saveapikey', click: buttonClickHandler, disabled: false, text: 'Sla API key op'}]} />
        <p>Config correct: {config.success === true ? 'Ja' : 'Nee'} </p>
    </div>  
        
}

export default withAuth(DarkSky)
