// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import DefaultTable from '../components/DefaultTable';
import Moment from 'react-moment';
import 'moment-timezone';
import useFetch from '../hooks/useFetch'

const Events = ({auth}) => {
    
    const [data, setData, loading, error, request] = useFetch('/api/events', {}, auth)
    const [all, setAll] = useState(false)
    
    useEffect(() => {
        const queryparams = (all ? '' : '?scope=last_week')
        request.get('/api/events', queryparams)
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
