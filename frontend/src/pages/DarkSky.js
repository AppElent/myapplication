// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

class DarkSky extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }
    
    async componentDidMount() {
        makeAPICall('/api/darksky/current', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data.hourly.data})})
    }
    
    render(){
        const columns = [{
            Header: 'Datum/tijd',
            accessor: 'time', // String-based value accessors!
            Cell: props => <Moment date={props.value*1000} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: 'Temperatuur',
            accessor: 'temperature',
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

export default withAuth(DarkSky)
