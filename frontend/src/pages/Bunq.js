import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { ListGroup} from 'react-bootstrap';

//import BunqJSClient from '@bunq-community/bunq-js-client';
//const BunqJSClient = require("../../dist/BunqJSClient").default;
import {makeAPICall, fetchBackend} from '../utils/fetching'
//import {groupBy, createArrayFromObject} from '../utils/arrays'
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import { withAuth } from '@okta/okta-react';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import useFetch from '../hooks/useFetch'
import BunqPaymentModal from '../components/BunqPaymentModal'

const Bunq = ({auth}) => {
//class Bunq extends Component {

    //const [accounts, setAccounts] = useState([]);
    const [accounts, setAccounts, accountsLoading, accountsError, accountsRequest] = useFetch('/api/bunq/accounts', {onMount: true}, auth)
    const [preconditions, setPreconditions] = useState({run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null});
    //const [rekeningen, setRekeningen] = useState([]);
    const [rekeningen, setRekeningen, rekeningenLoading, rekeningenError, rekeningenRequest] = useFetch('/api/rekeningen', {onMount: true}, auth)
    const [groupedData, setGroupedData] = useState([]);
    const [salaris, setSalaris] = useState(getLocalStorage('bunq_salaris') || '');
    const [eigen_geld, setEigenGeld] = useState(getLocalStorage('bunq_eigen_geld') || '');
    //const [sparen, setSparen] = useState(0);
    //const [page_loaded, setPageLoaded] = useState(false);
    //const [loading, setLoading] = useState(true);
    const [script_running, setScriptRunning] = useState(false);
    
    useEffect(() => {
        setLocalStorage('bunq_salaris', salaris);
    }, [salaris]);
    
    useEffect(() => {
        setLocalStorage('bunq_eigen_geld', eigen_geld);
    }, [eigen_geld]);
    
    const groupBy = async (xs, key) => {
      const object = xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
      //let result = []
      const result = Object.entries(object).map((item) => {
          //const sum = this.sum(item[1], 'month_1')
          let array = {rekening: item[0], entries: item[1]}
          for(var i = 1; i<13; i++){
                const sumvalue = sum(item[1], 'month_' + i);
                array['totaal_' + i] = sumvalue
          }
          return array;
      });
      //const result = Object.values(object);
      console.log(result);
      return result
    };
    
    
    /*
    const loadRekeningen = async () => {
        const data = await makeAPICall('/api/rekeningen?user=' + (await auth.getUser()).sub, 'GET', null, await auth.getAccessToken());
        const grouped = await groupBy(data, 'rekening');
        setRekeningen(grouped);
    }
    * */
    /*
    const loadPage = async () => {
        /*
        //setLoading(true);
        let call1 = makeAPICall('/api/bunq/accounts', 'GET', null, await auth.getAccessToken()).then((accounts) => { setAccounts(accounts)  })
        let call2 = loadRekeningen()

        await Promise.all([call1, call2]);
        //setPageLoaded(true);
        * *
        if(rekeningen.length > 0){
            console.log('jepjep');
            setRekeningen(await groupBy(rekeningen, 'rekening'))
        }
    }
    * */
    
    useEffect(() => {
        groupBy(rekeningen, 'rekening').then(groupedrek => {setGroupedData(groupedrek)})
    }, [rekeningen])

    
    const getAccountByName = (name) => {
        for(var account of accounts){
            if(account.description === name){
                return account;
            }
        }
        return null;
    }
    
    const checkPreconditions = () => {
        //check
        const algemeen_account = getAccountByName("Algemeen");
        let maandnummer = (new Date()).getMonth()+1;
        let currentstate = {...preconditions};
        currentstate.succeeded = true;
        currentstate.maandtotaal = 0;
        currentstate.incomeSufficient = true;
        currentstate.balanceSufficient = true;
        
        currentstate.balance = algemeen_account.balance.value;
        
        rekeningen.map(rekening => {
            currentstate.maandtotaal += rekening["totaal_" + maandnummer];
            let foundaccount = getAccountByName(rekening.rekening);
            if(foundaccount == null && rekening["totaal_" + maandnummer] > 0){
                currentstate.succeeded = false;
                currentstate.accountsExist.push(rekening.rekening)
                console.log("Rekening bestaat niet: " + rekening.rekening);
            }
        });
        if((parseFloat(algemeen_account.balance.value)) < salaris){
            currentstate.balanceSufficient = false;
            currentstate.succeeded = false;
        }
        if((currentstate.maandtotaal + eigen_geld) > salaris){
            currentstate.incomeSufficient = false;
            currentstate.sparen = 0;
            currentstate.succeeded = false;
        }else{
            currentstate.sparen = (salaris - currentstate.maandtotaal - eigen_geld);
            if(currentstate.balanceSufficient){
                currentstate.sparen = (currentstate.sparen + (Math.round(algemeen_account.balance.value) - salaris));
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

        setPreconditions(currentstate);
    }
    
    const runScript = async () => {
        //check
        setScriptRunning(true);
        //this.setState({script_running: true});
        let maandnummer = (new Date()).getMonth()+1;
        await Promise.all(rekeningen.map(async rekening => {
            console.log("Naar rekening " + rekening.rekening + " moet " + rekening["totaal_" + maandnummer] + " euro worden overgemaakt.");
            if(rekening["totaal_" + maandnummer] > 0){
                let overboeking = await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: rekening.rekening, description: "Geld apart zetten", amount: rekening["totaal_" + maandnummer].toString() + '.00'}, await auth.getAccessToken());
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
        let overboeking = await makeAPICall('/api/bunq/payment', 'POST', {from: "Algemeen", to: "Spaar", description: "Geld sparen", amount: preconditions.sparen.toString() + '.00'}, await auth.getAccessToken());
        console.log(overboeking);
        let accounts = await makeAPICall('/api/bunq/accounts', 'GET', null, await auth.getAccessToken())
        setAccounts(accounts);
        setScriptRunning(false);
        //this.setState({accounts: accounts, script_running: false});
    }
    
    const sum = (array, key) => {
        return array.reduce((a, b) => a + (b[key] || 0), 0);
    }
    
 
    const getTotal = (cellInfo) => {
        let total = 0
        if(groupedData.length > 0){
            for (let rekening of groupedData) {
              total += rekening[cellInfo.column.id]
            }
            let sparen = (salaris - eigen_geld - total);
            return (<div>{total}<br />{sparen}</div>);
        }
    }
    
   
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    const rekeningColumns = [{
        Header: 'Rekening',
        accessor: 'rekening', // String-based value accessors!
        Footer: <div><b>Totaal:</b><br /><b>Sparen:</b></div>
    },{
        Header: 'Huidig saldo',
        accessor: 'rekening', // String-based value accessors!
        Cell: props => <span>{getAccountByName(props.value) !== null ? '€'+getAccountByName(props.value).balance.value : '€-'}</span> // Custom cell components!
    }]
    for(var i = 1; i < 13; i++){
        rekeningColumns.push({
            Header: months[i-1],
            accessor: 'totaal_'+i,
            Footer: getTotal
        });
    }
    
    const formItems = [
        {name: 'salaris', type: 'input', label: 'Netto salaris:', value: salaris, changehandler: (e) => {setSalaris(e.target.value)}},
        {name: 'eigen_geld', type: 'input', label: 'Eigen geld:', value: eigen_geld, changehandler: (e) => {setEigenGeld(e.target.value)}}
    ]
    
    const formButtons = [
        {id: 'checkpreconditions', click: checkPreconditions, disabled: accountsLoading || script_running, text: 'Controleer'},
        {id: 'runscript', click: runScript, disabled: script_running || preconditions.succeeded === false, text: 'Boeken'}
    ]
    
    
    
    return (<div><h1>Bunq</h1>
            <DefaultTable data={groupedData} columns={rekeningColumns} loading={rekeningenLoading} pageSize={15}/>
            <DefaultFormRow data={formItems} buttons={formButtons}/>
            {/*
            <Form>
                <Row>
                <Col><Form.Label>Netto salaris</Form.Label><Form.Control type="text" name="salaris" value={salaris} onChange={(event) => setSalaris(event.target.value)} /></Col>
                <Col><Form.Label>Eigen geld</Form.Label><Form.Control type="text" name="eigen_geld" value={eigen_geld} onChange={(event) => setEigenGeld(event.target.value)} /></Col>
                <Button variant="primary" onClick={() => {checkPreconditions();console.log(preconditions);}} disabled={!page_loaded || script_running}>Controleer</Button>
                {preconditions.succeeded === true && <Button variant="primary" onClick={runScript} disabled={script_running}>Boeken</Button>}
                </Row>
            </Form>
            */}
            <ListGroup>
                {preconditions.balance !== null ?<ListGroup.Item variant="success">Huidig saldo Algemene rekening: {preconditions.balance}</ListGroup.Item> : ""}
                {preconditions.accountsExist.map((rek, i) => {return <ListGroup.Item  key={i} variant="danger">Rekening {rek} bestaat niet</ListGroup.Item>})}
                {preconditions.balanceSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende saldo. Salaris nog niet binnen?</ListGroup.Item> : ""}
                {preconditions.incomeSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende inkomen om alle rekeningen te betalen</ListGroup.Item> : ""}
                {preconditions.sparen !== null ? <ListGroup.Item variant="success">Er wordt {preconditions.sparen} gespaard</ListGroup.Item> : ""}
            </ListGroup>
            <BunqPaymentModal accounts={accounts} />
        </div>
    );

}

export default withAuth(Bunq)
