import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
//import moment from 'moment';
//import Moment from 'react-moment';
import 'moment-timezone';
//import { Button, Form, Row, Col } from 'react-bootstrap';
import DefaultTable from './DefaultTable';

//class MeterstandenTabel extends Component {
const MeterstandenTabel = ({data, loading}) => {
    
    
    const getTotal = (array, column) => {
        let total = 0
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
            }
            return (<div>{total}</div>);
        }
    }
    
    console.log(data);
    
    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'datetime', // String-based value accessors!
        //Cell: props => {const date = moment(props.value);return (this.props.timeframe === 'minute' ? date.format('YYYY-MM-DD HH:mm') : date.format('YYYY-MM-DD'))}
    }, {
        Header: '180',
        accessor: '180',
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '180 Verbruik',
        accessor: '180_diff',
        Footer: () => {return getTotal(data, '180_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '181',
        accessor: '181_diff',
        Footer: () => {return getTotal(data, '181_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '182',
        accessor: '182_diff',
        Footer: () => {return getTotal(data, '182_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '280',
        accessor: '280',
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '280 Teruglevering',
        accessor: '280_diff',
        Footer: () => {return getTotal(data, '280_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '281',
        accessor: '281_diff',
        Footer: () => {return getTotal(data, '281_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: '282',
        accessor: '282_diff',
        Footer: () => {return getTotal(data, '282_diff')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: 'Opwekking',
        accessor: 'opwekking',
        Footer: () => {return getTotal(data, 'opwekking')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: 'Bruto verbruik',
        accessor: 'bruto',
        Footer: () => {return getTotal(data, 'bruto')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        Header: 'Netto verbruik',
        accessor: 'netto',
        Footer: () => {return getTotal(data, 'netto')}
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }]  
    
    //var data = this.getDataBetweenDates(this.props.data, "2019-01-01", "2019-01-02").sort((a, b) => (a.datetime > b.datetime) ? 1 : -1)
    //console.log(this.extractColumn(this.props.data, "datetime"));  
    //console.log(this.extractColumn(this.props.data, "kwh_180"));  
    //console.log(this.getDifferenceArray(data, "kwh_180"));   
    
    //console.log(this.extractColumn(this.props.graphdata, "kwh_180"));
    //console.log(data, data.length);
    
    return <DefaultTable data={data} columns={columns} loading={loading}/>
    {/*
    <div>
    <ReactTable
        data={data}
        columns={columns}
        className='-highlight -striped'
        defaultPageSize={17}
        filterable={true}
    />
    </div>
        */}

    
}

export default MeterstandenTabel
