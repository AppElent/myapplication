// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';

const SolarEdge = ({auth}) => {
    const [data, setData] = useState([]);
    const [apikey, setApiKey] = useState(localStorage.getItem('solaredge_api_key') || '');
    const [siteID, setSiteID] = useState(localStorage.getItem('solaredge_site_id') || '');
    const [inverterID, setInterverID] = useState(localStorage.getItem('solaredge_inverter_id') || '');
    const [loading, setLoading] = useState(false);
    
    
    const getData = async () => {
        const date = moment();
        //const data = await makeAPICall('/api/solaredge/data/DAY/2019-02-25/' + date.format('YYYY-MM-DD'), 'GET', null, await auth.getAccessToken())
        //setData(data.energy.values);
    }
    
    useEffect(() => {
        getData();
    }, [])

    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'date', // String-based value accessors!
        Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'Opwekking',
        accessor: 'value',
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }]  
    
    const apiKeyHandler = (event) => setApiKey(event.target.value);
    
    const buttonClickHandler = (event) => {event.preventDefault(); localStorage.setItem('solaredge_api_key', apikey);}
    
    let formItems = [{
        id: 'apikey',
        type: 'input',
        label: 'API key',
        value: apikey,
        changehandler: apiKeyHandler
    }] 
    
    return <div><h2>SolarEdge connection</h2>
        <DefaultFormRow data={formItems} button={{click: buttonClickHandler, disabled: false, text: 'Sla API key op en laad gegevens'}} />
        {apikey !== '' && inverterID !== '' && siteID !== '' && <DefaultTable data={data} columns={columns}/>   }
    </div>  
        
}

export default withAuth(SolarEdge)
