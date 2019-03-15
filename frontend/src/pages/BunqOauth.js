import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {makeAPICall} from '../utils/fetching'

class BunqGenerate extends Component {
    constructor(props) {
        super(props);
        this.state = {
          url: null,
        }        
      
    }
    
   
    async componentDidMount(){
        makeAPICall('/api/bunq/oauth/formatUrl', 'GET', null, null)
        .then((data) => {this.setState({url: data})})
    }
    
    
    render(){
        return (<div><h1>Bunq Generate</h1>
            <Button variant="primary" href={this.state.url} disabled={this.state.url === null ? true : false}>Get Key</Button>
            </div>
        );
    }
} 

export default BunqGenerate
