// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';
import {fetchData} from '../utils/fetching'


class Rekeningen extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
            groupeddata: [],
        }
    }
    
    async componentDidMount() {
        fetchData('/api/rekeningen', await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data})})
        fetchData('/api/groupedrekeningen', await this.props.auth.getAccessToken())
        .then((data) => {this.setState({groupeddata: data})});
    }
    
    render(){
        const columns = [{
            Header: 'Naam',
            accessor: 'naam' // String-based value accessors!
        },{
            Header: 'Dag vd maand',
            accessor: 'dag' // String-based value accessors!
        }, {
            Header: 'Bedrag',
            accessor: 'januari',
        }, {
            Header: 'Type',
            accessor: 'type',
        }, {
            Header: 'Rekening',
            accessor: 'rekening',
        }]            

        return <ReactTable
            data={this.state.data}
            columns={columns}
            className='striped bordered hover'
        />          
        
    }
}

export default withAuth(Rekeningen)
