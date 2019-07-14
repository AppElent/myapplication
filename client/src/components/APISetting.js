import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';


import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import {getLocalStorage, setLocalStorage, getLocalUserStorage, setLocalUserStorage} from '../utils/localstorage';
import Moment from 'react-moment';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import { Button, ButtonToolbar } from 'react-bootstrap';

const APISetting = ({auth, lskey, title, fields, saveFunction}) => {
    const [config, setConfig] = useState(getLocalStorage(lskey) || {success: false});

    console.log(auth, lskey, title, fields, saveFunction);
    
    const saveSetting = () => {
        if(saveFunction === null){
            setLocalStorage(lskey, config)
        }else{
            saveFunction(config);
        }
    }
    
    console.log(getLocalUserStorage('jantje', 'tado'));
    setLocalUserStorage('jantje', 'tado', {success: true})
    console.log(getLocalUserStorage('jantje', 'tado'));

    const buttonClickHandler = (event) => saveSetting()
    
    const formItems = fields.map((item) => {
        return {
            name: item.name,
            type: (item.visible === false ? 'password' : 'input'),
            label: item.label,
            value: config[item.name],
            changehandler: (event) => setConfig({...config, [event.target.name]:event.target.value}),
        }
    })
    
    return <div><h2>{title}</h2>
        <DefaultFormRow data={formItems} buttons={[{id: 'savecredentials', click: buttonClickHandler, disabled: false, text: 'Save'}]} />
    </div>  
        
}

export default withAuth(APISetting)
