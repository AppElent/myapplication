// ./src/car/car.component.jsx
import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';
import { makeAPICall} from '../utils/fetching'


class Rekeningen extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
            newEntry: {naam: "", dag: 1, type: "", rekening: "", bedrag: 0},
            newEntryTemplate: {naam: "", dag: 1, type: "", rekening: "", bedrag: 0},
        }
    }
    
    async componentDidMount() {
        makeAPICall('/api/rekeningen', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data})})
        .then((data) => {console.log(this.state.data)})
        //fetchData('/api/groupedrekeningen', await this.props.auth.getAccessToken())
        //.then((data) => {this.setState({groupeddata: data})})
        //.then((data) => {console.log(this.state.groupeddata)})
    }
    
    handleChange = event => {
        let newEntry = this.state.newEntry;
        let newEntryItem = newEntry[event.target.name];
        let newValue = event.target.value
        if(Number.isInteger(newEntryItem)){
            newValue = parseInt(newValue);
        }
        newEntry[event.target.name] = newValue;
        
        this.setState(newEntry);
        //console.log(newEntry);
        //if (event.target.name === "firstName")
          //this.setState({ firstName: event.target.value });
        //if (event.target.name === "lastName")
          //this.setState({ lastName: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        let newEntry = this.state.newEntry;
        for(var i = 1; i < 13; i++){
            newEntry['month_'+i] = newEntry.bedrag
        }
        let returndata = await makeAPICall('/api/rekeningen', 'POST', newEntry, await this.props.auth.getAccessToken());
        this.setState(prevState => ({
          data: [...prevState.data, returndata],
          newEntry: prevState.newEntryTemplate
        }))
        console.log(returndata);
    };
    
    handleDelete = async (row) => {
        console.log(row);
        await makeAPICall('/api/rekeningen/' + row.id, 'DELETE', null, await this.props.auth.getAccessToken());
        this.setState({data: this.state.data.filter(function(item) { 
            return item.id !== row.id
        })});
        
    }
    
    renderEditable = (cellInfo) => {
        return (
          <div
            //style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={async (e) => {
              const data = [...this.state.data];
              let newValue = e.target.innerHTML;
              if(Number.isInteger(data[cellInfo.index][cellInfo.column.id])){
                  newValue = parseInt(newValue);
              }
              if(newValue !== data[cellInfo.index][cellInfo.column.id]){
                  data[cellInfo.index][cellInfo.column.id] = newValue;
                  let toChangeItem = {[cellInfo.column.id]: newValue}
                  console.log('/api/rekeningen/' + data[cellInfo.index].id, toChangeItem);
                  let putdataresult = await makeAPICall('/api/rekeningen/' + data[cellInfo.index].id, 'PUT', toChangeItem, await this.props.auth.getAccessToken())
                  console.log(putdataresult);
                  //console.log("tochange", toChangeItem);
                  //console.log(cellInfo);
                  
                  this.setState({ data });
              }
            }}
            dangerouslySetInnerHTML={{
              __html: this.state.data[cellInfo.index][cellInfo.column.id]
            }}
          />
        );
    };
    
    render(){
        var columns = [{
            Header: 'Naam',
            accessor: 'naam', // String-based value accessors!
            Cell: this.renderEditable
        },{
            Header: 'Dag vd maand',
            accessor: 'dag', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Type',
            accessor: 'type',
            Cell: this.renderEditable
        }, {
            Header: 'Rekening',
            accessor: 'rekening',
            Cell: this.renderEditable
        }]
        const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
        for(var i = 1; i < 13; i++){
            columns.push({
                Header: months[i-1],
                accessor: 'month_'+i,
                Cell: this.renderEditable
            });
        }
        columns.push({
           Header: '',
           Cell: row => (
               <div>
                   <Button variant="danger" onClick={() => this.handleDelete(row.original)}>Delete</Button>
               </div>
           )
        });      

        return (
        <div>
        <div className="App-intro">
          <form onSubmit={this.handleSubmit}>
            <h3>Nieuwe rekening toevoegen</h3>
            <label>
              Naam:
              <Form.Control 
                type="text"
                name="naam"
                value={this.state.newEntry.naam}
                onChange={this.handleChange}
              />
            </label>{" "}
            <label>
              Dag vd maand:
              <Form.Control 
                type="number"
                name="dag"
                value={Number.isNaN(this.state.newEntry.dag) ? "" : this.state.newEntry.dag}
                onChange={this.handleChange}
              />
            </label> {" "}
            <label>
              Type:
              <Form.Control 
                type="text"
                name="type"
                value={this.state.newEntry.type}
                onChange={this.handleChange}
              />
            </label> {" "}
            <label>
              Rekening:
              <Form.Control 
                type="text"
                name="rekening"
                value={this.state.newEntry.rekening}
                onChange={this.handleChange}
              />
            </label> {" "}
            <label>
              Bedrag:
              <Form.Control 
                type="number"
                name="bedrag"
                value={Number.isNaN(this.state.newEntry.bedrag) ? "" : this.state.newEntry.bedrag}
                onChange={this.handleChange}
              />
            </label> {" "}
            <label> {" "}
                <Button variant="outline-primary" type="submit">Voeg toe</Button>
            </label>
          </form>
        </div>
        <ReactTable
            data={this.state.data}
            columns={columns}
            className='-highlight -striped'
            pageSize={11}
            //showPagination={false}
            //pageSize={this.state.data.length}
            filterable={true}
        />          
        </div>
        )
    }
}

export default withAuth(Rekeningen)
