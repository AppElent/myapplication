// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall, makeAPICallFromNodeJS} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';

const SolarEdge = ({auth}) => {
    const [data, setData] = useState([]);
    const [apikey, setApiKey] = useState(getLocalStorage('solaredge_api_key') || '');
    const [siteID, setSiteID] = useState(getLocalStorage('solaredge_site_id') || '');
    const [inverterID, setInterverID] = useState(getLocalStorage('solaredge_inverter_id') || '');
    const [loading, setLoading] = useState(false);
    
    const solaredge_host = 'https://monitoringapi.solaredge.com'
    
    const getSolarEdgeData = async (url) => {
        url = solaredge_host + url + "&api_key=" + apikey + "&format=application/json";
        const data = await makeAPICallFromNodeJS(url, 'GET', undefined, undefined, await auth.getAccessToken());
        return (data);
    }
    
    const getData = async () => {
        const date = moment();
        //const data = await makeAPICall('/api/solaredge/data/DAY/2019-02-25/' + date.format('YYYY-MM-DD'), 'GET', null, await auth.getAccessToken())
        //setData(data.energy.values);
    }
    
    const setSiteAndInverter = async () => {
        const site = await getSolarEdgeData('/sites/list?size=1');
        const siteID = site.sites.site[0].id;
        const equipment = await getSolarEdgeData('/equipment/' + siteID + '/list?size=1')
        const inverterSN = equipment.reporters.list[0].serialNumber;
        setInterverID(inverterSN);
        setSiteID(siteID);
        setLocalStorage('solaredge_site_id', siteID);
        setLocalStorage('solaredge_inverter_id', inverterSN);
    }
    
    useEffect(() => {
        //getData();
        //setSiteAndInverter();
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
    
    const buttonClickHandler = (event) => {event.preventDefault(); setLocalStorage('solaredge_api_key', apikey);setSiteAndInverter();}
    
    let formItems = [{
        id: 'apikey',
        type: 'input',
        label: 'API key',
        value: apikey,
        changehandler: apiKeyHandler
    }] 
    
    return <div><h2>SolarEdge connection</h2>
        <DefaultFormRow data={formItems} button={{click: buttonClickHandler, disabled: false, text: 'Sla API key op en laad gegevens'}} />
        {siteID !== '' && <p>Site ID: {siteID}</p>}
        {inverterID !== '' && <p>Inverter ID: {inverterID}</p>}
        {apikey !== '' && inverterID !== '' && siteID !== '' && <DefaultTable data={data} columns={columns}/>   }
    </div>  
        
}

export default withAuth(SolarEdge)
