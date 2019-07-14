import React, { useState, useEffect } from 'react';


import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

const Tado = ({auth}) => {
    const [data, setData] = useState([]);
    const [config, setConfig] = useState(getLocalStorage('tado') || {username: '', password: '', token: '', refreshToken: '', success: false});
    const [username, setUsername] = useState(getLocalStorage('tado_username') || '');
    const [password, setPassword] = useState(getLocalStorage('tado_password') || '');
    
   
    const saveConfig = async () => {
        
    }
    
    useEffect(() => {
        setLocalStorage('tado', config)
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
    
    //const change = (event) => setApiKey(event.target.value);
    
    const buttonClickHandler = (event) => saveConfig()
    
    let formItems = [{
        name: 'un',
        type: 'input',
        label: 'Username',
        value: username,
        changehandler: (event) => setUsername(event.target.value),
    },{
        name: 'pw',
        type: 'password',
        label: 'Password',
        value: password,
        changehandler: (event) => setPassword(event.target.value),
    }] 
    
    return <div><h2>Tado connection</h2>
        <DefaultFormRow data={formItems} buttons={[{id: 'savecredentials', click: buttonClickHandler, disabled: false, text: 'Sla credentials op'}]} />
    </div>  
        
}

export default withAuth(Tado)
