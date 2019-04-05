import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import { Button, Form, Row, Col } from 'react-bootstrap';

class MeterstandenTabel extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            //data: props.data,
            //graphdata: props.graphdata,
            //solaredgedata: props.solaredgedata,
            //ophalen: props.ophalen,
            //datums: {dagstanden_from: "", dagstanden_to: "", kwartierstanden_from: "", kwartierstanden_to: ""}
        }
    }
    
    getTotal = (array, column) => {
        let total = 0
        //console.log(this.state.rekeningen);
        //console.log(column);
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
              //console.log(rekening[column]);
            }
            return (<div>{total}</div>);
        }
    }
    
    
    render(){
        //console.log("sedata", this.props.solaredgedata);
        var totaal_bruto = 0;
        var totaal_netto = 0;
        const columns = [{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            Cell: props => {const date = moment(props.value);return (this.props.timeframe === 'day' ? date.subtract(1, 'days').format('YYYY-MM-DD') : date.format('YYYY-MM-DD HH:mm'))}
        }, {
            Header: '180',
            accessor: '180',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '180 Verbruik',
            accessor: '180_diff',
            Footer: () => {return this.getTotal(this.props.data, '180_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '181',
            accessor: '181_diff',
            Footer: () => {return this.getTotal(this.props.data, '181_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '182',
            accessor: '182_diff',
            Footer: () => {return this.getTotal(this.props.data, '182_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '280',
            accessor: '280',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '280 Teruglevering',
            accessor: '280_diff',
            Footer: () => {return this.getTotal(this.props.data, '280_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '281',
            accessor: '281_diff',
            Footer: () => {return this.getTotal(this.props.data, '281_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '282',
            accessor: '282_diff',
            Footer: () => {return this.getTotal(this.props.data, '282_diff')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Opwekking',
            accessor: 'opwekking',
            Footer: () => {return this.getTotal(this.props.data, 'opwekking')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Bruto verbruik',
            accessor: 'bruto',
            Footer: () => {return this.getTotal(this.props.data, 'bruto')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Netto verbruik',
            accessor: 'netto',
            Footer: () => {return this.getTotal(this.props.data, 'netto')}
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }]  
        
        //var data = this.getDataBetweenDates(this.props.data, "2019-01-01", "2019-01-02").sort((a, b) => (a.datetime > b.datetime) ? 1 : -1)
        //console.log(this.extractColumn(this.props.data, "datetime"));  
        //console.log(this.extractColumn(this.props.data, "kwh_180"));  
        //console.log(this.getDifferenceArray(data, "kwh_180"));   
        
        //console.log(this.extractColumn(this.props.graphdata, "kwh_180"));
        
        return <div>
        {/*
        <Form>
            <Row>
            <Col><Form.Label>Dagstanden vanaf</Form.Label><Form.Control type="text" name="dagstanden_from" value={this.props.datums.dagstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Dagstanden tm</Form.Label><Form.Control type="text" name="dagstanden_to" value={this.props.datums.dagstanden_to} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden vanaf</Form.Label><Form.Control type="text" name="kwartierstanden_from" value={this.props.datums.kwartierstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden tm</Form.Label><Form.Control type="text" name="kwartierstanden_to" value={this.props.datums.kwartierstanden_to} onChange={this.handleChange} /></Col>
            <Button variant="outline-primary" type="submit" onClick={this.haalMeterstandenOp} disabled={this.props.ophalen}>Haal op</Button>
            </Row>
        </Form>
        * */}
        <ReactTable
            data={this.props.data}
            columns={columns}
            className='-highlight -striped'
            defaultPageSize={17}
            filterable={true}
        />
        </div>
        
    }
    
}

export default MeterstandenTabel