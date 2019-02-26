// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Moment from 'react-moment';
import 'moment-timezone';
import { withAuth } from '@okta/okta-react';

class Events extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }
    
    async componentDidMount() {
        fetch('/api/events', {
            headers: {
              Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
            }
          }).then((Response) => Response.json())
            .then((findresponse) =>
            {
                console.log(findresponse)
                this.setState({
                    data: findresponse
                })
            })
    }
    
    render(){
        const columns = [{
            Header: '',
            accessor: 'id' // String-based value accessors!
        },{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: 'Event',
            accessor: 'value',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }]        
        
        return <ReactTable
            data={this.state.data}
            columns={columns}
            className='striped bordered hover'
        />       
        
        /*
        return (
              <Table striped bordered hover size="sm"><thead><tr><th>ID</th><th>Datetime</th><th>Value</th></tr></thead>
              <tbody>{this.state.data.map(function(item, key) {
                     
                       return (
                          <tr key = {key}>
                              <td>{item.id}</td>
                              <td>{item.datetime}</td>
                              <td>{item.value}</td>
                          </tr>
                        )
                     
                     })}</tbody>
               </Table>
        );
        */
    }
}

export default withAuth(Events)
