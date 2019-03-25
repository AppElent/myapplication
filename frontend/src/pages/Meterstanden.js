// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
import { Button, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';

class MeterstandElektra extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
            ophalen: false,
            datums: {dagstanden_from: "", dagstanden_to: "", kwartierstanden_from: "", kwartierstanden_to: ""}
        }
    }
    
    async componentDidMount() {
        makeAPICall('/api/meterstanden', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data})});
    }
    
    zetDatums = () => {
        let datums = this.state.datums;
        
        datums.dagstanden_from = moment(((this.state.data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.dagstanden_to = moment(((this.state.data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_from = moment(((this.state.data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_to = moment(((this.state.data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        this.setState({datums: datums});
        //console.log(datums);
    }
    
    haalMeterstandenOp = async () => {
        this.setState({ophalen: true})
        let datums = this.state.datums;
        let body = {
            dagstanden_from: (datums.dagstanden_from === "" ? null : datums.dagstanden_from),
            dagstanden_to: (datums.dagstanden_to === "" ? null : datums.dagstanden_to),
            kwartierstanden_from: (datums.kwartierstanden_from === "" ? null : datums.kwartierstanden_from),
            kwartierstanden_to: (datums.kwartierstanden_to === "" ? null : datums.kwartierstanden_to),
        }
        await makeAPICall('/api/meterstanden/elektra/update', 'POST', body, await this.props.auth.getAccessToken())
        makeAPICall('/api/meterstanden/elektra', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data, ophalen: false})})
    }
    
    handleChange = event => {
        let datums = this.state.datums;
        let item = datums[event.target.name];
        let newValue = event.target.value
        datums[event.target.name] = newValue;
        
        this.setState(datums);
    };
    
    extractColumn = (array, column) => {
        return array.map(x => x[column]);
    }
    
    getDataBetweenDates = (array, from, to) => {
        return array.filter((item: any) =>
            new Date(item.datetime) >= (new Date(from)) && new Date(item.datetime) <= (new Date(to))
        );
    }
    
    render(){
        const columns = [{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: '180',
            accessor: 'kwh_180',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '181',
            accessor: 'kwh_181',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '182',
            accessor: 'kwh_182',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '280',
            accessor: 'kwh_280',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '281',
            accessor: 'kwh_281',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '282',
            accessor: 'kwh_282',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Opwekking',
            accessor: 'kwh_opwekking',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Warmte',
            accessor: 'warmte',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }]  
        
        console.log(this.getDataBetweenDates(this.state.data, "2019-01-01", "2019-01-03"));
        console.log(this.extractColumn(this.state.data, "datetime"));  
        console.log(this.extractColumn(this.state.data, "kwh_180"));      
        
        return <div>
        <Form>
            <Row>
            <Col><Form.Label>Dagstanden vanaf</Form.Label><Form.Control type="text" name="dagstanden_from" value={this.state.datums.dagstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Dagstanden tm</Form.Label><Form.Control type="text" name="dagstanden_to" value={this.state.datums.dagstanden_to} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden vanaf</Form.Label><Form.Control type="text" name="kwartierstanden_from" value={this.state.datums.kwartierstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden tm</Form.Label><Form.Control type="text" name="kwartierstanden_to" value={this.state.datums.kwartierstanden_to} onChange={this.handleChange} /></Col>
            <Button variant="outline-primary" type="submit" onClick={this.haalMeterstandenOp} disabled={this.state.ophalen}>Haal op</Button>
            </Row>
        </Form>
        <ReactTable
            data={this.state.data}
            columns={columns}
            className='-highlight -striped'
            defaultPageSize={17}
            filterable={true}
        />
        <Button variant="outline-primary" type="submit" onClick={this.zetDatums}>Zet datums</Button>
        </div>
    }
}

export default withAuth(MeterstandElektra)
