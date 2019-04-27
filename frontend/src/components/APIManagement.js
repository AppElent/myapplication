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
import Enelogic from '../components/Enelogic'
import APISetting from '../components/APISetting'
import OAuthSetting from '../components/OAuthSetting'

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
        <OAuthSetting title='Enelogic' formatUrl='/api/enelogic/oauth/formaturl' lskey='enelogic'/> 
        <APISetting title='Tado connection' lskey='tado' fields={[{name: 'username', label: 'Username'},{name: 'password', label: 'Password', visible:false}]} saveFunction={saveTado}/>
    </div>
        
}

export default withAuth(APIManagement)
