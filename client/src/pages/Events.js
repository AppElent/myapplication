
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { withAuth } from '@okta/okta-react';
import DefaultTable from '../components/DefaultTable';
import Moment from 'react-moment';
import useFetch from '../hooks/useFetch'

const Events = ({auth}) => {
    
    const {data, loading, error, request} = useFetch('/api/events', {auth})
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
        Header: 'Event',
        accessor: 'value',
    }]        
    
    return <div>
        <h1>Events</h1> 
        <Button variant="contained" color="primary" onClick={() => {setAll(all => !all)}}> {all ? 'Last week' : 'All'}</Button>
        {!error && <DefaultTable data={data} columns={columns} loading={loading} /> }
        {error && <p>Fout met laden</p>}
    </div>

}

export default withAuth(Events)
