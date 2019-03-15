import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
            preconditions: {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0},
            script: [],
            rekeningen: [],
            salaris: 3082,
            eigen_geld: 80,
            sparen: 0,
            page_loaded: false,
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
    }
    
    checkPreconditions = () => {
        //check
        console.log("Checking");
        const algemeen_account = this.getAccountByName("Algemeen");
        let maandnummer = (new Date()).getMonth()+1;
        let currentstate = this.state.preconditions;
        currentstate.succeeded = true;
        currentstate.maandtotaal = 0;
        console.log("maandnummer: " + maandnummer);
        
        this.state.rekeningen.map(rekening => {
            currentstate.maandtotaal += rekening["totaal_" + maandnummer];
            let foundaccount = this.getAccountByName(rekening.rekening);
            if(foundaccount == null && rekening["totaal_" + maandnummer] > 0){
                currentstate.succeeded = false;
                currentstate.accountsExist.push(rekening.rekening)
                console.log("Rekening bestaat niet: " + rekening.rekening);
            }
        });
        currentstate.sparen = 99;
        if((this.state.maandtotaal + this.state.eigen_geld) > this.state.salaris){
            currentstate.incomeSufficient = false;
            currentstate.sparen = 0;
            currentstate.succeeded = false;
        }else{
            currentstate.sparen = (this.state.salaris - currentstate.maandtotaal - this.state.eigen_geld);
        }
        if((parseFloat(algemeen_account.balance.value)) < this.state.salaris){
            currentstate.balanceSufficient = false;
            currentstate.succeeded = false;
        }
        
        console.log(algemeen_account);
        this.setState({preconditions: currentstate});
        console.log("maandtotaal: " + currentstate.maandtotaal);
        console.log(this.state.preconditions);
    }
    
    runScript = async () => {
        //check
        console.log("Running script");
        let maandnummer = (new Date()).getMonth()+1;
        for (var rekening of this.state.rekeningen){
            console.log("Naar rekening " + rekening.rekening + " moet " + rekening["totaal_" + maandnummer] + " euro worden overgemaakt.");
            if(rekening["totaal_" + maandnummer] > 0){
                //await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: rekening.rekening, description: "Geld apart zetten", amount: "0.01"}, await this.props.auth.getAccessToken());
            }
        }
        //await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: "Spaar", description: "Geld sparen", amount: "0.01"}, await this.props.auth.getAccessToken());
    }
    
    getTotal = (column) => {
        let total = 0
        //console.log(this.state.rekeningen);
        if(this.state.rekeningen.length > 0){
            for (let rekening of this.state.rekeningen) {
              total += rekening[column]
              //console.log(this.state.rekeningen[i].totaal_1);
            }
            return total
        }
    }
    
    render(){
        //Initialize

        
        const rekeningColumns = [{
            Header: 'Rekening',
            accessor: 'rekening', // String-based value accessors!
            Footer: <b>Totaal:</b>
        },{
            Header: 'Januari',
            accessor: 'totaal_1',
            Footer: () => {return this.getTotal("totaal_1")}
        }, {
            Header: 'Februari',
            accessor: 'totaal_2',
            Footer: () => {return this.getTotal("totaal_2")}
        }, {
            Header: 'Maart',
            accessor: 'totaal_3',
            Footer: () => {return this.getTotal("totaal_3")}
        }, {
            Header: 'April',
            accessor: 'totaal_4',
            Footer: () => {return this.getTotal("totaal_4")}
        }, {
            Header: 'Mei',
            accessor: 'totaal_5',
            Footer: () => {return this.getTotal("totaal_5")}
        }, {
            Header: 'Juni',
            accessor: 'totaal_6',
            Footer: () => {return this.getTotal("totaal_6")}
        }, {
            Header: 'Juli',
            accessor: 'totaal_7',
            Footer: () => {return this.getTotal("totaal_7")}
        }, {
            Header: 'Augustus',
            accessor: 'totaal_8',
            Footer: () => {return this.getTotal("totaal_8")}
        }, {
            Header: 'September',
            accessor: 'totaal_9',
            Footer: () => {return this.getTotal("totaal_9")}
        }, {
            Header: 'Oktober',
            accessor: 'totaal_10',
            Footer: () => {return this.getTotal("totaal_10")}
        }, {
            Header: 'November',
            accessor: 'totaal_11',
            Footer: () => {return this.getTotal("totaal_11")}
        }, {
            Header: 'December',
            accessor: 'totaal_12',
            Footer: () => {return this.getTotal("totaal_12")}
        }]   
        return (<div><h1>Bunq</h1>
                
                {/*
                <ReactTable
                    data={this.state.accounts}
                    columns={columns}
                    className='striped bordered hover'
                />   
                */}
                <ReactTable
                    data={this.state.rekeningen}
                    columns={rekeningColumns}
                    className='-highlight -striped'
                    showPagination={false}
                    pageSize={this.state.rekeningen.length}
                    filterable={true}
                    sorted={[{ // the sorting model for the table
                       id: 'rekening',
                       desc: false
                    }]}
                />   
                <Button variant="primary" onClick={this.checkPreconditions} disabled={!this.state.page_loaded}>Check preconditions</Button>
                <Button variant="primary" onClick={this.runScript} disabled={this.state.preconditions.succeeded}>Run script</Button>
                <ul>
                    {this.state.preconditions.accountsExist.map((rek, i) => {return <li key={i}> Rekening {rek} bestaat niet</li>})}
                    {this.state.preconditions.balanceSufficient === false ? <li>Niet voldoende saldo</li> : ""}
                    {this.state.preconditions.incomeSufficient === false ? <li>Niet voldoende inkomen om alle rekeningen te betalen</li> : ""}
                    {this.state.preconditions.sparen !== null ? <li>Er wordt {this.state.preconditions.sparen} gespaard</li> : ""}
                </ul>
            </div>
        );
    }
}

export default withAuth(Bunq)
