// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Moment from 'react-moment';
import 'moment-timezone';
import { withAuth } from '@okta/okta-react';
import {fetchData} from '../utils/fetching'

class Events extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }
    
    async componentDidMount() {
        fetchData('/api/events', await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data})})
    }
    
    render(){
        const columns = [{
            Header: '',
            accessor: 'id' // String-based value accessors!
        },{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: 'Event',
            accessor: 'value',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }]        
        
        return <ReactTable
            data={this.state.data}
            columns={columns}
            className='striped bordered hover'
        />
    }
}

export default withAuth(Events)
