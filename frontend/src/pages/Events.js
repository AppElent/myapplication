// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import DefaultTable from '../components/DefaultTable';
import Moment from 'react-moment';
import 'moment-timezone';

const Events = ({auth}) => {
    
    const [data, setEventData] = useState([])
    const [all, setAll] = useState(false)
    const [loading, setLoading] = useState(true);

    const loadData = async (givenScope) => {
        setLoading(true)
        const queryparams = (givenScope ? '?user=' + (await auth.getUser()).sub : '?scope=last_week&user=' + (await auth.getUser()).sub)
        const eventurl = '/api/events/' + queryparams
        console.log(eventurl);
        const eventdata = await makeAPICall(eventurl, 'GET', null, await auth.getAccessToken())
        setEventData(eventdata);
        setLoading(false);
    }
    
    useEffect(() => {
        loadData(all);
    }, [all])
    
    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'datetime',
        Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'User',
        accessor: 'user',
    }, {
        Header: 'Event',
        accessor: 'value',
    }]        
    
    return <div><h1>Events</h1><Button onClick={() => {setAll(all => !all)}}>{all ? 'Last week' : 'All'}</Button> <DefaultTable data={data} columns={columns} loading={loading} /></div>

}

export default withAuth(Events)
