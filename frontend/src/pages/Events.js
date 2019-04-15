// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import DefaultTable from '../components/DefaultTable';
import Moment from 'react-moment';
import 'moment-timezone';

const Events = ({auth}) => {
    
    const [data, setEventData] = useState([])
    const [all, setAll] = useState(false)

    const loadData = async (givenScope) => {
        const scope = (givenScope ? '' : '?scope=last_week')
        const eventdata = await makeAPICall('/api/events' + scope, 'GET', null, await auth.getAccessToken())
        setEventData(eventdata);
    }
    
    useEffect(() => {
        loadData(all);
    }, [])
    
    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'datetime',
        Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'Event',
        accessor: 'value',
    }]        
    
    return <div><Button onClick={() => {loadData(!all);setAll(!all)}}>{all ? 'Last week' : 'All'}</Button> <DefaultTable data={data} columns={columns} loading={data.length > 0 ? false : true} /></div>

}

export default withAuth(Events)
