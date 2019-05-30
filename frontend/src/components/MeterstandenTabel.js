import React from 'react';
import DefaultTable from './DefaultTable';

const MeterstandenTabel = ({data, loading}) => {
    
    
    const getTotal = (array, column) => {
        let total = 0
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
            }
            if(isNaN(total)) total = '';
            return (<div>{total}</div>);
        }
    }
    
    const columns = [{
        Header: 'Datum/tijd',
        accessor: 'datetime', // String-based value accessors!
    }, {
        Header: '180',
        accessor: '180',
    }, {
        Header: '180 Verbruik',
        accessor: '180_diff',
        Footer: () => {return getTotal(data, '180_diff')}
    }, {
        Header: '181',
        accessor: '181_diff',
        Footer: () => {return getTotal(data, '181_diff')}
    }, {
        Header: '182',
        accessor: '182_diff',
        Footer: () => {return getTotal(data, '182_diff')}
    }, {
        Header: '280',
        accessor: '280',
    }, {
        Header: '280 Teruglevering',
        accessor: '280_diff',
        Footer: () => {return getTotal(data, '280_diff')}
    }, {
        Header: '281',
        accessor: '281_diff',
        Footer: () => {return getTotal(data, '281_diff')}
    }, {
        Header: '282',
        accessor: '282_diff',
        Footer: () => {return getTotal(data, '282_diff')}
    }, {
        Header: 'Opwekking',
        accessor: 'opwekking',
        Footer: () => {return getTotal(data, 'opwekking')}
    }, {
        Header: 'Bruto verbruik',
        accessor: 'bruto',
        Footer: () => {return getTotal(data, 'bruto')}
    }, {
        Header: 'Netto verbruik',
        accessor: 'netto',
        Footer: () => {return getTotal(data, 'netto')}
    }]  
    
   
    return <DefaultTable data={data} columns={columns} loading={loading}/>
    
}

export default MeterstandenTabel
