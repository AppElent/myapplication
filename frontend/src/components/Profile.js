import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

const Profile = ({auth}) => {
    

    
    return <div><h2>Profile</h2></div>  
        
}

export default withAuth(Profile)
