// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import DefaultTable from '../components/DefaultTable';
import Moment from 'react-moment';
import 'moment-timezone';

const Events = ({auth}) => {
//class Events extends Component {
    
    const [data, setEventData] = useState([])

    const loadData = async () => {
        const eventdata = await makeAPICall('/api/events', 'GET', null, await auth.getAccessToken())
        setEventData(eventdata);
    }
    
    useEffect(() => {
        loadData();
    }, [])
    
    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'datetime', // String-based value accessors!
        Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
    }, {
        Header: 'Event',
        accessor: 'value',
    }]        
    
    return <DefaultTable data={data} columns={columns} loading={data.length > 0 ? false : true} />

}

export default withAuth(Events)
