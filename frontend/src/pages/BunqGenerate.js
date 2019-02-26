import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import BunqJSClient from '@bunq-community/bunq-js-client';
//const BunqJSClient = require("../../dist/BunqJSClient").default;

class BunqGenerate extends Component {
    constructor(props) {
        super(props);
        this.state = {
          clientid: null,
          clientsecret: null,
        }        
        this.client = null;
        this.redirectUri = 'https://ericjansen.synology.me/bunq/generate';
        this.state = 'abcdefg';
        this.code =  null;//'';
        
        //function bindings
        this.start = this.start.bind(this, this);
        this.setQueryParameter = this.setQueryParameter.bind(this);
      
    }
    

    setQueryParameter(){
        let url = this.props.location.search;
        console.log(url);
        if(url.startsWith('?code=')){
            this.code = url.replace('?code=', '');
        }
        console.log(this.code);
    }
    
    async start(){
        //make url
        if(this.apikey !== null){
            return;
        }
        this.setQueryParameter();
        if(this.code !== null){
            //const authorizationCode = 'testapikey';
            //console.log(this.clientid + '<><>' + this.clientsecret + '<><>' + this.redirectUri + '<><>' + this.code);
            const authorizationCode = await this.client.exchangeOAuthToken(
                this.state.clientid, 
                this.state.clientsecret, 
                this.redirectUri, 
                this.code, 
                this.state
            )
            console.log("authcode:"+authorizationCode);
            
            return;
        }
        let url = this.client.formatOAuthAuthorizationRequestUrl(
            this.state.clientid, 
            this.redirectUri, 
            this.state
        );   
        console.log(url);
        this.url = url;
    }
    
    
    render(){
        //Initialize
        this.client = new BunqJSClient();
        
        this.start();
        

        return (<div><h1>Bunq Generate</h1>
            <p>Code: {this.code}</p>
            <p>Apikey: {this.apikey}</p>
            <p>Url: {this.url}</p>
            <Button variant="primary" href={this.url} disabled={this.apikey == null ? false : true}>Get Key</Button>
            </div>
        );
    }
}

export default BunqGenerate
