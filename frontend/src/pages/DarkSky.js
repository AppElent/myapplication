import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall, makeAPICallFromNodeJS} from '../utils/fetching';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

const DarkSky = ({auth}) => {
    const [data, setData] = useState([]);
    const [apikey, setApiKey] = useState(localStorage.getItem('darksky_api_key') || '');
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState('');
    
    const getData = async () => {
        const data = await makeAPICall('/api/darksky/current', 'GET', null, await auth.getAccessToken())
        setData(data.hourly.data);
        const test = await makeAPICallFromNodeJS('https://api.darksky.net/forecast/09cbbe0257a566a4aa20e1c8e0be4757/52.21860580000001, 5.280716600000005?units=auto&lang=nl', 'GET', undefined, undefined, await auth.getAccessToken());
        console.log(test);
    }
    
    useEffect(() => {
        getData();
    }, [])

    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'time', // String-based value accessors!
        Cell: props => <Moment date={props.value*1000} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'Temperatuur',
        accessor: 'temperature',
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }]  
    
    const apiKeyHandler = (event) => setApiKey(event.target.value);
    
    const buttonClickHandler = (event) => {event.preventDefault(); localStorage.setItem('darksky_api_key', apikey);}
    
    const testhandler = (event) => setTestUrl(event.target.value);
    
    const testButtonClickHandler = async (event) => {
        event.preventDefault(); 
        const data = await makeAPICallFromNodeJS(testUrl, 'GET', undefined, undefined, await auth.getAccessToken())
        setTestResult(data);
    };
    
    let formItems = [{
        id: 'apikey',
        type: 'input',
        label: 'API key',
        value: apikey,
        changehandler: apiKeyHandler
    }] 
    
    return <div><h2>DarkSky connection</h2>

        <DefaultFormRow data={formItems} button={{click: buttonClickHandler, disabled: false, text: 'Sla API key op'}} />
        {apikey !== '' &&
        <div>
        <DefaultFormRow data={[{id:'url', type:'input', label:'Test API', value:testUrl, changehandler:testhandler}]} button={{click: testButtonClickHandler, disabled: false, text: 'Test'}} />
        <div>{JSON.stringify(testResult, null, 4)}</div>
        <DefaultTable data={data} columns={columns}/> </div>  }
    </div>  
        
}

export default withAuth(DarkSky)
