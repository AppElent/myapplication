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

const APIManagement = ({auth}) => {
    

    
    return <div>
        <SolarEdge />
        <Tado />
        <DarkSky />
        <Enelogic />
        
    </div>
        
}

export default withAuth(APIManagement)
