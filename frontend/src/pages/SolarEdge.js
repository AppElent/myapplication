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
    const [solaredgeConfig, setSolaredgeConfig] = useState(getLocalStorage('solaredge') || {api_key: '', site: null, inverter: null, success: false});
    //const [apikey, setApiKey] = useState(getLocalStorage('solaredge_api_key') || '');
    //const [siteID, setSiteID] = useState(getLocalStorage('solaredge_site_id') || '');
    //const [inverterID, setInterverID] = useState(getLocalStorage('solaredge_inverter_id') || '');
    //const [loading, setLoading] = useState(false);
    
    const solaredge_host = 'https://monitoringapi.solaredge.com'
    
    const getSolarEdgeData = async (url) => {
        url = solaredge_host + url + "&api_key=" + solaredgeConfig.api_key + "&format=application/json";
        console.log(url);
        const data = await makeAPICallFromNodeJS(url, 'GET', undefined, undefined, await auth.getAccessToken());
        console.log(data);
        return (data);
    }
    
    const getData = async () => {
        //const date = moment();
        //const data = await makeAPICall('/api/solaredge/data/DAY/2019-02-25/' + date.format('YYYY-MM-DD'), 'GET', null, await auth.getAccessToken())
        //setData(data.energy.values);
    }
    
    const saveSolarEdgeConfig = async () => {
        const site = await getSolarEdgeData('/sites/list?size=1');
        if(site.message !== undefined){
            setSolaredgeConfig({api_key: solaredgeConfig.api_key, site: null, inverter: null, success: false})
            return;
        }
        const siteID = site.sites.site[0].id;
        const equipment = await getSolarEdgeData('/equipment/' + siteID + '/list?size=1')
        const inverterSN = equipment.reporters.list[0].serialNumber;
        const config = {api_key: solaredgeConfig.api_key, site: siteID, inverter: inverterSN, success: true}
        console.log(config);
        setSolaredgeConfig(config);
        //setInterverID(inverterSN);
        //setSiteID(siteID);
        //setLocalStorage('solaredge_site_id', siteID);
        //setLocalStorage('solaredge_inverter_id', inverterSN);
    }
    
    useEffect(() => {
        setLocalStorage('solaredge', solaredgeConfig)
    }, [solaredgeConfig])

   
    const apiKeyHandler = (event) => setSolaredgeConfig({...solaredgeConfig, 'api_key': event.target.value});
    
    const buttonClickHandler = (event) => saveSolarEdgeConfig();//{event.preventDefault(); setLocalStorage('solaredge_api_key', apikey);setSiteAndInverter();}
    
    let formItems = [{
        name: 'apikey',
        type: 'input',
        label: 'API key',
        value: solaredgeConfig.api_key,
        changehandler: apiKeyHandler
    }] 
    
    return <div><h2>SolarEdge connection</h2>
        <DefaultFormRow data={formItems} buttons={[{id: 'saveapikey', click: buttonClickHandler, disabled: false, text: 'Sla API key op en laad gegevens'}]} />
        {solaredgeConfig.success && <p>Configuratie correct <br /> Site ID: {solaredgeConfig.site}<br /> Inverter ID: {solaredgeConfig.inverter}</p>}
        {solaredgeConfig.success === false && <p>Geen of onjuiste API KEY ingevuld</p>}
    </div>  
        
}

export default withAuth(SolarEdge)
