// ./src/car/car.component.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';
import { makeAPICall} from '../utils/fetching'
import DefaultFormRow from '../components/DefaultFormRow';


const Rekeningen = ({auth}) => {
    
    const newEntryTemplate = {naam: "", dag: 1, type: "", rekening: "", bedrag: 0}
    
    const [data, setData] = useState([]);
    const [newEntry, setNewEntry] = useState(newEntryTemplate);
    const [loading, setLoading] = useState(true);

    
    
    const loadData = async () => {
        setLoading(true);
        const resultdata = await makeAPICall('/api/rekeningen?user=' + (await auth.getUser()).sub, 'GET', null, await auth.getAccessToken())
        setData(resultdata);
        console.log(resultdata);
        setLoading(false);
    }
    
    useEffect(() => {
        loadData();
    }, [])
    
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
        //console.log(newEntry);
        //if (event.target.name === "firstName")
          //this.setState({ firstName: event.target.value });
        //if (event.target.name === "lastName")
          //this.setState({ lastName: event.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        //e.preventDefault();
        let newEntryData = {...newEntry}
        for(var i = 1; i < 13; i++){
            newEntryData['month_'+i] = newEntryData.bedrag
        }
        //console.log(newEntryData);
        newEntryData['user'] = (await auth.getUser()).sub
        let returndata = await makeAPICall('/api/rekeningen', 'POST', newEntryData, await auth.getAccessToken());
        setData([...data, returndata])
        setNewEntry(newEntryTemplate)
        setLoading(false);
        /*
        this.setState(prevState => ({
          data: [...prevState.data, returndata],
          newEntry: prevState.newEntryTemplate
        }))
        * */
        //console.log(returndata);
    };
    
    const handleDelete = async (row) => {
        setLoading(true);
        console.log(row);
        await makeAPICall('/api/rekeningen/' + row.id, 'DELETE', null, await auth.getAccessToken());
        const newdata = data.filter(function(item) { 
            return item.id !== row.id
        })
        setData(newdata);
        setLoading(false);
    }
    
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
                  let putdataresult = await makeAPICall('/api/rekeningen/' + newdata[cellInfo.index].id, 'PUT', toChangeItem, await auth.getAccessToken())
                  console.log(putdataresult);
                  //console.log("tochange", toChangeItem);
                  //console.log(cellInfo);
                  
                  setData(newdata)
                  //this.setState({ data });
              }
            }}
            dangerouslySetInnerHTML={{
              __html: data[cellInfo.index][cellInfo.column.id]
            }}
          />
        );
    };
    
    var columns = [{
        Header: 'Naam',
        accessor: 'naam', // String-based value accessors!
        Cell: renderEditable
    },{
        Header: 'Dag vd maand',
        accessor: 'dag', // String-based value accessors!
        Cell: renderEditable
    }, {
        Header: 'Type',
        accessor: 'type',
        Cell: renderEditable
    }, {
        Header: 'Rekening',
        accessor: 'rekening',
        Cell: renderEditable
    }]
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    for(var i = 1; i < 13; i++){
        columns.push({
            Header: months[i-1],
            accessor: 'month_'+i,
            Cell: renderEditable
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
    {/*
    <div className="App-intro">
      <form onSubmit={handleSubmit}>
        <h3>Nieuwe rekening toevoegen</h3>
        <label>
          Naam:
          <Form.Control 
            type="text"
            name="naam"
            value={newEntry.naam}
            onChange={handleChange}
          />
        </label>{" "}
        <label>
          Dag vd maand:
          <Form.Control 
            type="number"
            name="dag"
            value={Number.isNaN(newEntry.dag) ? "" : newEntry.dag}
            onChange={handleChange}
          />
        </label> {" "}
        <label>
          Type:
          <Form.Control 
            type="text"
            name="type"
            value={newEntry.type}
            onChange={handleChange}
          />
        </label> {" "}
        <label>
          Rekening:
          <Form.Control 
            type="text"
            name="rekening"
            value={newEntry.rekening}
            onChange={handleChange}
          />
        </label> {" "}
        <label>
          Bedrag:
          <Form.Control 
            type="number"
            name="bedrag"
            value={Number.isNaN(newEntry.bedrag) ? "" : newEntry.bedrag}
            onChange={handleChange}
          />
        </label> {" "}
        <label> {" "}
            <Button variant="outline-primary" type="submit">Voeg toe</Button>
        </label>
      </form>
    </div>   
    * */} 
    </div>
    )
}

export default withAuth(Rekeningen)
