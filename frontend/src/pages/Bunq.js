import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button, ListGroup, Form, Col, Row } from 'react-bootstrap';

//import BunqJSClient from '@bunq-community/bunq-js-client';
//const BunqJSClient = require("../../dist/BunqJSClient").default;
import {makeAPICall} from '../utils/fetching'
import { withAuth } from '@okta/okta-react';
import ReactTable from "react-table";
import 'react-table/react-table.css';



class Bunq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            preconditions: {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null},
            script: [],
            rekeningen: [],
            salaris: 3082,
            eigen_geld: 80,
            sparen: 0,
            page_loaded: false,
            script_running: false,
        }
    }
    
    componentDidMount = async () => {
        let call1 = makeAPICall('/api/bunq/accounts', 'GET', null, await this.props.auth.getAccessToken())
        .then((accounts) => {this.setState({accounts: accounts})})
        //.then((accounts) => {console.log(this.state.accounts)})
        let call2 = makeAPICall('/api/groupedrekeningen', 'GET', null, await this.props.auth.getAccessToken())
        .then((rekeningen) => {this.setState({rekeningen: rekeningen})})
        
        //.then((rekeningen) => {console.log(this.state.rekeningen)})
        await Promise.all([call1, call2]);
        this.setState({page_loaded: true});
    }
    
    getAccountByName = (name) => {
        for(var account of this.state.accounts){
            const objectKeys = Object.keys(account);
            const objectKey = objectKeys[0];
            //console.log(account[objectKey].description);
            if(account[objectKey].description === name){
                return account[objectKey];
            }
        }
        return null;
    }
    
    checkPreconditions = () => {
        //check
        const algemeen_account = this.getAccountByName("Algemeen");
        let maandnummer = (new Date()).getMonth()+1;
        let currentstate = this.state.preconditions;
        currentstate.succeeded = true;
        currentstate.maandtotaal = 0;
        currentstate.incomeSufficient = true;
        currentstate.balanceSufficient = true;
        
        currentstate.balance = algemeen_account.balance.value;
        
        this.state.rekeningen.map(rekening => {
            currentstate.maandtotaal += rekening["totaal_" + maandnummer];
            let foundaccount = this.getAccountByName(rekening.rekening);
            if(foundaccount == null && rekening["totaal_" + maandnummer] > 0){
                currentstate.succeeded = false;
                currentstate.accountsExist.push(rekening.rekening)
                console.log("Rekening bestaat niet: " + rekening.rekening);
            }
        });
        if((parseFloat(algemeen_account.balance.value)) < this.state.salaris){
            currentstate.balanceSufficient = false;
            currentstate.succeeded = false;
        }
        if((this.state.maandtotaal + this.state.eigen_geld) > this.state.salaris){
            currentstate.incomeSufficient = false;
            currentstate.sparen = 0;
            currentstate.succeeded = false;
        }else{
            currentstate.sparen = (this.state.salaris - currentstate.maandtotaal - this.state.eigen_geld);
            if(currentstate.balanceSufficient){
                currentstate.sparen = (currentstate.sparen + (Math.round(algemeen_account.balance.value) - this.state.salaris));
            }
            //console.log(currentstate);
            if(currentstate.sparen < 0){
                currentstate.sparen = 0;
                currentstate.incomeSufficient = false;   
                currentstate.succeeded = false;
            }else{
                currentstate.incomeSufficient = true;
            }
            
        }

        
        this.setState({preconditions: currentstate});
    }
    
    runScript = async () => {
        //check
        this.setState({script_running: true});
        let maandnummer = (new Date()).getMonth()+1;
        await Promise.all(this.state.rekeningen.map(async rekening => {
            console.log("Naar rekening " + rekening.rekening + " moet " + rekening["totaal_" + maandnummer] + " euro worden overgemaakt.");
            if(rekening["totaal_" + maandnummer] > 0){
                let overboeking = await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: rekening.rekening, description: "Geld apart zetten", amount: rekening["totaal_" + maandnummer].toString() + '.00'}, await this.props.auth.getAccessToken());
                console.log(overboeking);
            }
        }))
        /*
        for (var rekening of this.state.rekeningen){
            console.log("Naar rekening " + rekening.rekening + " moet " + rekening["totaal_" + maandnummer] + " euro worden overgemaakt.");
            if(rekening["totaal_" + maandnummer] > 0){
                let overboeking = await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: rekening.rekening, description: "Geld apart zetten", amount: rekening["totaal_" + maandnummer].toString() + '.00'}, await this.props.auth.getAccessToken());
                console.log(overboeking);
            }
        }
        * */
        console.log("Erna");
        let overboeking = await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: "Spaar", description: "Geld sparen", amount: this.state.preconditions.sparen.toString() + '.00'}, await this.props.auth.getAccessToken());
        console.log(overboeking);
        let accounts = await makeAPICall('/api/bunq/accounts', 'GET', null, await this.props.auth.getAccessToken())
        this.setState({accounts: accounts, script_running: false});
    }
    
    getTotal = (column) => {
        let total = 0
        //console.log(this.state.rekeningen);
        //console.log(column);
        if(this.state.rekeningen.length > 0){
            for (let rekening of this.state.rekeningen) {
              total += rekening[column]
              //console.log(rekening[column]);
            }
            let sparen = (this.state.salaris - this.state.eigen_geld - total);
            return (<div>{total}<br />{sparen}</div>);
        }
    }
    
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    
    render(){
        //Initialize

        const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
        const rekeningColumns = [{
            Header: 'Rekening',
            accessor: 'rekening', // String-based value accessors!
            Footer: <div><b>Totaal:</b><br /><b>Sparen:</b></div>
        },{
            Header: 'Huidig saldo',
            accessor: 'rekening', // String-based value accessors!
            Cell: props => <span>{this.getAccountByName(props.value) !== null ? '€'+this.getAccountByName(props.value).balance.value : '€-'}</span> // Custom cell components!
        },{
            Header: months[0],
            accessor: 'totaal_1',
            Footer: () => {return this.getTotal('totaal_1')}
        },{
            Header: months[1],
            accessor: 'totaal_2',
            Footer: () => {return this.getTotal('totaal_2')}
        },{
            Header: months[2],
            accessor: 'totaal_3',
            Footer: () => {return this.getTotal('totaal_3')}
        },{
            Header: months[3],
            accessor: 'totaal_4',
            Footer: () => {return this.getTotal('totaal_4')}
        },{
            Header: months[4],
            accessor: 'totaal_5',
            Footer: () => {return this.getTotal('totaal_5')}
        },{
            Header: months[5],
            accessor: 'totaal_6',
            Footer: () => {return this.getTotal('totaal_6')}
        },{
            Header: months[6],
            accessor: 'totaal_7',
            Footer: () => {return this.getTotal('totaal_7')}
        },{
            Header: months[7],
            accessor: 'totaal_8',
            Footer: () => {return this.getTotal('totaal_8')}
        },{
            Header: months[8],
            accessor: 'totaal_9',
            Footer: () => {return this.getTotal('totaal_9')}
        },{
            Header: months[9],
            accessor: 'totaal_10',
            Footer: () => {return this.getTotal('totaal_10')}
        },{
            Header: months[10],
            accessor: 'totaal_11',
            Footer: () => {return this.getTotal('totaal_11')}
        },{
            Header: months[11],
            accessor: 'totaal_12',
            Footer: () => {return this.getTotal('totaal_12')}
        }]
        return (<div><h1>Bunq</h1>
                
                <ReactTable
                    data={this.state.rekeningen}
                    columns={rekeningColumns}
                    className='-highlight -striped'
                    showPagination={false}
                    pageSize={this.state.rekeningen.length}
                    filterable={true}
                    //sorted={[{ // the sorting model for the table
                       //id: 'rekening',
                       //desc: false
                    //}]}
                />   
                <Form>
                    <Row>
                    <Col><Form.Label>Netto salaris</Form.Label><Form.Control type="text" name="salaris" value={this.state.salaris} onChange={this.handleChange} /></Col>
                    <Col><Form.Label>Eigen geld</Form.Label><Form.Control type="text" name="eigen_geld" value={this.state.eigen_geld} onChange={this.handleChange} /></Col>
                    <Button variant="primary" onClick={this.checkPreconditions} disabled={!this.state.page_loaded || this.state.script_running}>Controleer</Button>
                    {this.state.preconditions.succeeded === true && <Button variant="primary" onClick={this.runScript} disabled={this.state.script_running}>Boeken</Button>}
                    </Row>
                </Form>
                
                
                
                <ListGroup>
                    {this.state.preconditions.balance !== null ?<ListGroup.Item variant="success">Huidig saldo Algemene rekening: {this.state.preconditions.balance}</ListGroup.Item> : ""}
                    {this.state.preconditions.accountsExist.map((rek, i) => {return <ListGroup.Item  key={i} variant="danger">Rekening {rek} bestaat niet</ListGroup.Item>})}
                    {this.state.preconditions.balanceSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende saldo. Salaris nog niet binnen?</ListGroup.Item> : ""}
                    {this.state.preconditions.incomeSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende inkomen om alle rekeningen te betalen</ListGroup.Item> : ""}
                    {this.state.preconditions.sparen !== null ? <ListGroup.Item variant="success">Er wordt {this.state.preconditions.sparen} gespaard</ListGroup.Item> : ""}
                </ListGroup>
                
            </div>
        );
    }
}

export default withAuth(Bunq)
