import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import BunqJSClient from '@bunq-community/bunq-js-client';
//const BunqJSClient = require("../../dist/BunqJSClient").default;

class BunqGenerate extends Component {
    constructor(props) {
        super(props);
        
        this.apikey = 'a7528d84b9b07ccb76edb137a9f5aba0021a9ffa3115c19a61d6ac25ca849974';

      
    }
    
    render(){
        //Initialize
        this.client = new BunqJSClient();

        return (<div><h1>Bunq</h1>

            </div>
        );
    }
}

export default BunqGenerate
