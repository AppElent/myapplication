// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching'

class Events extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }
    
    async componentDidMount() {
        makeAPICall('/api/events', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data})})
    }
    
    render(){
        const columns = [{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            //Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: 'Event',
            accessor: 'value',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }]        
        
        return <ReactTable
            data={this.state.data}
            columns={columns}
            className='-highlight -striped'
            defaultPageSize={17}
            filterable={true}
        />
    }
}

export default withAuth(Events)
