// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';


class Rekeningen extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
            groupeddata: [],
        }
    }
    
    async componentDidMount() {
        fetch('/api/rekeningen', {
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
          await fetch('/api/groupedrekeningen', {
            headers: {
              Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
            }
          })
          .then((Response) => Response.json())
          .then((findresponse) =>
            {
                console.log(findresponse)
                this.setState({
                    groupeddata: findresponse
                })
            })
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
