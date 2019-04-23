// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';

const Settings = ({auth}) => {
    
    const newEntryTemplate = {firstname: '', lastname: '', email: "", access_level: 1}
    
    const [newEntry, setNewEntry] = useState(newEntryTemplate)
    const [userdata, setUserdata] = useState([])
    const [profiledata, setProfileData] = useState({})
    const [load, setLoading] = useState(false)

    const loadData = async () => {
        const call1 = makeAPICall('/api/users', 'GET', null, await auth.getAccessToken()).then(data1 => setUserdata(data1))
        const call2 = makeAPICall('/api/users/' + (await auth.getUser()).sub, 'GET', null, await auth.getAccessToken()).then(data2 => setProfileData(data2))
    }
    
    const createOktaUser = async () => {
        
    }
    
    useEffect(() => {
        loadData();
    }, [])
    
    const handleSubmit = async (e) => {
        setLoading(true);
        let newEntryData = {...newEntry}
        
        
        //User aanmaken in okta
        const body = {
          "profile": {
            "firstName": newEntryData.firstname,
            "lastName": newEntryData.lastname,
            "email": newEntryData.email,
            "login": newEntryData.email,
          }
        }
        console.log(body)
        const user = await makeAPICall('/api/okta/create', 'POST', body, await auth.getAccessToken());
        console.log(user);
        
        //User toevoegen in database
        //e.preventDefault();
        
        newEntryData['id'] = user.id
        let returndata = await makeAPICall('/api/users', 'POST', newEntryData, await auth.getAccessToken());
        setUserdata([...userdata, returndata])
        setNewEntry(newEntryTemplate)
        setLoading(false);
    };
    
    const handleChange = event => {
        let prevstate = {...newEntry}
        let newEntryItem = prevstate[event.target.name];
        let newValue = event.target.value
        if(Number.isInteger(newEntryItem)){
            newValue = parseInt(newValue);
        }
        prevstate[event.target.name] = newValue;
        console.log(prevstate);
        setNewEntry(prevstate);
    };
    
    
    const columns = [{
        Header: 'Firstname',
        accessor: 'firstname',
    },{
        Header: 'Lastname',
        accessor: 'lastname',
    },{
        Header: 'E-mail',
        accessor: 'email',
    }, {
        Header: 'ID',
        accessor: 'id',
    }, {
        Header: 'Access Level',
        accessor: 'access_level',
    }]   
    
    const formItems = [{
        name: 'firstname',
        type: 'input',
        label: 'Firstname:',
        value: newEntry.firstname,
        changehandler: handleChange
    },{
        name: 'lastname',
        type: 'input',
        label: 'Lastname:',
        value: newEntry.lastname,
        changehandler: handleChange
    },{
        name: 'email',
        type: 'input',
        label: 'E-mailadres:',
        value: newEntry.email,
        changehandler: handleChange
    },{
        name: 'access_level',
        type: 'number',
        label: 'Access level:',
        value: Number.isNaN(newEntry.access_level) ? "" : newEntry.access_level,
        changehandler: handleChange
    }]    
    
    return <div>
        <h1>User settings</h1>
            <DefaultTable data={userdata} columns={columns} />
            <DefaultFormRow data={formItems} buttons={[{id: 'savebutton', click: handleSubmit, disabled: false, text: 'Voeg toe'}]}/>
        </div>

}

export default withAuth(Settings)
