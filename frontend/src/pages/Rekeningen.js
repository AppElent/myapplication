// ./src/car/car.component.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Button } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';
import { makeAPICall} from '../utils/fetching'
import DefaultFormRow from '../components/DefaultFormRow';

import useFetch from '../hooks/useFetch'
import useAuth from '../hooks/useAuth'
import useForm from '../hooks/useForm'
import editableCell from '../utils/editableCell'

const Rekeningen = ({auth}) => {
    
    const submitForm = async () => {
        let newEntryData = {...newEntry}
        for(var i = 1; i < 13; i++){
            newEntryData['month_'+i] = newEntryData.bedrag
        }
        //console.log(newEntryData);
        newEntryData['user'] = user.sub
        await request.post(newEntryData);
        setData([...data, newEntryData]);
        //request.get();
    };
    
    
    //const newEntryTemplate = {naam: "", dag: 1, type: "", rekening: "", bedrag: 0}
    const [ newEntry, handleChange, handleSubmit ] = useForm(submitForm, {naam: "", dag: 1, type: "", rekening: "", bedrag: 0});


    const [authenticated, user, sub] = useAuth(auth);
    const [data, setData, loading, error, request] = useFetch('/api/rekeningen', {onMount: true}, auth)
    //const [newEntry, setNewEntry] = useState(newEntryTemplate);
    
    /*
    const handleChange = event => {
        console.log(event.target.name, event.target.value);
        let prevstate = {...newEntry}
        let newEntryItem = prevstate[event.target.name];
        let newValue = event.target.value
        if(Number.isInteger(newEntryItem)){
            newValue = parseInt(newValue);
        }
        prevstate[event.target.name] = newValue;
        console.log(prevstate);
        setNewEntry(prevstate);
    };
    * */


    
    const handleDelete = async (row) => {
        await request.delete('/api/rekeningen/' + row.id)
        const newdata = data.filter(function(item) { 
            return item.id !== row.id
        })
        setData(newdata);
    }
    
    /*
    const renderEditable = (cellInfo) => {
        return (
          <div
            //style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={async (e) => {
              const newdata = [...data];
              let newValue = e.target.innerHTML;
              if(Number.isInteger(data[cellInfo.index][cellInfo.column.id])){
                  newValue = parseInt(newValue);
              }
              if(newValue !== newdata[cellInfo.index][cellInfo.column.id]){
                  newdata[cellInfo.index][cellInfo.column.id] = newValue;
                  let toChangeItem = {[cellInfo.column.id]: newValue}
                  console.log('/api/rekeningen/' + newdata[cellInfo.index].id, toChangeItem);
                  await request.put('/api/rekeningen/' + newdata[cellInfo.index].id, toChangeItem);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: data[cellInfo.index][cellInfo.column.id]
            }}
          />
        );
    };
    * */
    
   
    var columns = [{
        Header: 'Naam',
        accessor: 'naam', // String-based value accessors!
        Cell: editableCell(data, (cell, item) => {request.put('/api/rekeningen/' + data[cell.index].id, item);})
    },{
        Header: 'Dag vd maand',
        accessor: 'dag', // String-based value accessors!
        Cell: editableCell(data, (cell, item) => {request.put('/api/rekeningen/' + data[cell.index].id, item);})
    }, {
        Header: 'Type',
        accessor: 'type',
        Cell: editableCell(data, (cell, item) => {request.put('/api/rekeningen/' + data[cell.index].id, item);})
    }, {
        Header: 'Rekening',
        accessor: 'rekening',
        Cell: editableCell(data, (cell, item) => {request.put('/api/rekeningen/' + data[cell.index].id, item);})
    }]
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    for(var i = 1; i < 13; i++){
        columns.push({
            Header: months[i-1],
            accessor: 'month_'+i,
            Cell: editableCell(data, (cell, item) => {request.put('/api/rekeningen/' + data[cell.index].id, item);})
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
        <ReactTable
            data={data}
            columns={columns}
            className='-highlight -striped'
            pageSize={11}
            //showPagination={false}
            //pageSize={this.state.data.length}
            filterable={true}
            loading={loading}
        />  
    <h3>Nieuwe rekening toevoegen</h3>
    <DefaultFormRow data={formItems} buttons={buttonItems}/>
    </div>
    )
}

export default withAuth(Rekeningen)
