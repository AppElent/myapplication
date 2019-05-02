import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

import SolarEdge from '../components/SolarEdge';
import DarkSky from '../components/DarkSky';
import Tado from '../components/Tado';
import Enelogic from '../components/Enelogic';
import APISetting from '../components/APISetting';
import OAuthSetting from '../components/OAuthSetting';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';
import useFetchedForm from '../hooks/useFetchedForm';

const getFormItems = (fields, config, handleChange) => {
    const formItems = fields.map((item) => {
        return {
            name: item.name,
            type: (item.visible === false ? 'password' : 'input'),
            label: item.label,
            value: config[item.name],
            changehandler: handleChange,
        }
    })
    return formItems
}

const EnelogicSetting = ({auth}) => {
    
    const saveEnelogic = async () => {
        //user: await (auth.getUser()).sub, 
        if(config.id !== undefined){
            request.put('/api/usersettings/' + config.id, {setting: 'enelogic', data: JSON.stringify(config)})
        }else{
            request.post('/api/usersettings', {setting: 'enelogic', data: JSON.stringify(config)})
        }
    }
    
    const [config, handleChange, handleSubmit, setConfig, request ] = useFetchedForm(auth, '/api/usersettings/setting/enelogic', saveEnelogic, {api_key: '', success: false});
    const fields = [{name: 'api_key', label: 'API Key'}]

    return <div><h2>Enelogic</h2>
        <DefaultFormRow data={getFormItems(fields, config, handleChange)} buttons={[{id: 'savecredentials', click: handleSubmit, disabled: false, text: 'Save'}]} />
    </div>  
}


const APIManagement = ({auth}) => {
    
    const saveTado = (config) => {console.log('the config is', config)}
    const saveSolarEdge = (config) => {
        config.success = true;
        //setConfig(config); <-- deze kan ik hier niet gebruiken want setConfig bestaat alleen IN APISetting
    }
    
    return <div>
        <SolarEdge />
        <Tado />
        <DarkSky />
        <Enelogic />
        <EnelogicSetting auth={auth}/>
        <OAuthSetting title='Enelogic' formatUrl='/api/oauth/formaturl/enelogic' lskey='enelogic' redirectUri='/settings?tab=apimanagement'/> 
        <APISetting title='Tado connection' lskey='tado' fields={[{name: 'username', label: 'Username'},{name: 'password', label: 'Password', visible:false}]} saveFunction={saveTado}/>
    </div>
        
}

export default withAuth(APIManagement)
