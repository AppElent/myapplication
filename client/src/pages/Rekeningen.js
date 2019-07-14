// ./src/car/car.component.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Button } from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import DefaultFormRow from '../components/DefaultFormRow';

import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useForm'
import editableCell from '../utils/editableCell';
import DefaultTable from '../components/DefaultTable';
import {fetchBackend} from '../utils/fetching';

const Rekeningen = ({auth}) => {
    
    const submitForm = async () => {
        let newEntryData = {...newEntry}
        for(var i = 1; i < 13; i++){
            newEntryData['month_'+i] = newEntryData.bedrag
        }
        
        //newEntryData['user'] = user.sub
        await request.post(newEntryData);
        setData([...data, newEntryData]);
    };
    
    const [ newEntry, handleChange, handleSubmit, submitting, changing ] = useForm(submitForm, {naam: "", dag: 1, type: "", rekening: "", bedrag: 0});
    const [data, setData, loading, error, request] = useFetch('/api/rekeningen', {onMount: true, auth})

    const handleDelete = async (row) => {
        await fetchBackend('/api/rekeningen/' + row.id, {method: 'delete', auth})
        const newdata = data.filter(function(item) { 
            return item.id !== row.id
        })
        setData(newdata);
    }
   
   
    var columns = [{
        Header: 'Naam',
        accessor: 'naam', // String-based value accessors!
        Cell: editableCell(data, (cell, item) => {fetchBackend('/api/rekeningen/' + data[cell.index].id, {method: 'put', auth, body: item});})
    },{
        Header: 'Dag vd maand',
        accessor: 'dag', // String-based value accessors!
        Cell: editableCell(data, (cell, item) => {fetchBackend('/api/rekeningen/' + data[cell.index].id, {method: 'put', auth, body: item});})
    }, {
        Header: 'Type',
        accessor: 'type',
        Cell: editableCell(data, (cell, item) => {fetchBackend('/api/rekeningen/' + data[cell.index].id, {method: 'put', auth, body: item});})
    }, {
        Header: 'Rekening',
        accessor: 'rekening',
        Cell: editableCell(data, (cell, item) => {fetchBackend('/api/rekeningen/' + data[cell.index].id, {method: 'put', auth, body: item});})
    }]
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    for(var i = 1; i < 13; i++){
        columns.push({
            Header: months[i-1],
            accessor: 'month_'+i,
            Cell: editableCell(data, (cell, item) => {fetchBackend('/api/rekeningen/' + data[cell.index].id, {method: 'put', auth, body: item});})
        });
    }
    columns.push({
       Header: '',
       Cell: row => (
           <div>
               <Button variant="danger" onClick={() => handleDelete(row.original)} disabled={loading}>Delete</Button>
           </div>
       )
    });  
    
    const formItems = [{
        name: 'naam',
        type: 'input',
        label: 'Naam:',
        value: newEntry.naam,
        changehandler: handleChange
    },{
        name: 'dag',
        type: 'number',
        label: 'Dag vd maand:',
        value: Number.isNaN(newEntry.dag) ? "" : newEntry.dag,
        changehandler: handleChange
    },{
        name: 'type',
        type: 'input',
        label: 'Type:',
        value: newEntry.type,
        changehandler: handleChange
    },{
        name: 'rekening',
        type: 'input',
        label: 'Rekening:',
        value: newEntry.rekening,
        changehandler: handleChange
    },{
        name: 'bedrag',
        type: 'input',
        label: 'Bedrag:',
        value: Number.isNaN(newEntry.bedrag) ? "" : newEntry.bedrag,
        changehandler: handleChange
    }]    
    
    const buttonItems = [{
        id: 'savebutton', 
        click: handleSubmit, 
        disabled: false, 
        text: 'Voeg toe'
    }]
    
    if(error){
        alert(error)
    }
    
    return (
    <div>
    <h1>Rekeningen</h1>
        <DefaultTable data={data} columns={columns} loading={loading} pageSize={11}/>
    <h3>Nieuwe rekening toevoegen</h3>
    <DefaultFormRow data={formItems} buttons={buttonItems}/>
    </div>
    )
}

export default withAuth(Rekeningen)
