import React, { useState, useEffect, useContext } from 'react';

import { ListGroup} from 'react-bootstrap';
import {getLocalStorage, setLocalStorage} from '../utils/localstorage';
import { withAuth } from '@okta/okta-react';
import DefaultTable from '../components/DefaultTable';
import DefaultFormRow from '../components/DefaultFormRow';
import useFetch from '../hooks/useFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import BunqPaymentModal from '../components/BunqPaymentModal'
import { AuthContext } from '../context/AuthContext';
import { fetchBackend } from '../utils/fetching';
import _ from 'lodash';

const Bunq = ({auth}) => {
//class Bunq extends Component {
    
    const groupData = (test) => (data) => {
        console.log(12, test, data);
        console.log(_.groupBy(data, 'rekening'))
    }
    
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
    
    //const [accounts, setAccounts] = useState([]);
    const { sub } = useContext(AuthContext);
    const [bunqSettings, setBunqSettings] = useLocalStorage(sub, 'bunq_settings', {income: 0, keep: 0})
    const [accounts, setAccounts, accountsLoading, accountsError, accountsRequest] = useFetch('/api/bunq/accounts', {onMount: true, auth})
    const [preconditions, setPreconditions] = useState({run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null});
    //const [rekeningen, setRekeningen] = useState([]);
    const [rekeningen, setRekeningen, rekeningenLoading, rekeningenError, rekeningenRequest] = useFetch('/api/rekeningen', {onMount: true, auth, postProcess: groupData('blabla')})
    const [groupedData, setGroupedData] = useState([]);
    const [script_running, setScriptRunning] = useState(false);
    
    useEffect(() => {
        groupBy(rekeningen, 'rekening').then(groupedrek => {setGroupedData(groupedrek)})
    }, [rekeningen])

    
    
    const checkPreconditions = () => {
        //check
        const algemeen_account = accounts.find(account => account.description === 'Algemeen');
        let maandnummer = (new Date()).getMonth()+1;
        let currentstate = {...preconditions};
        currentstate.succeeded = true;
        currentstate.maandtotaal = 0;
        currentstate.incomeSufficient = true;
        currentstate.balanceSufficient = true;
        
        currentstate.balance = algemeen_account.balance.value;
        console.log(currentstate);
        rekeningen.map(rekening => {
            currentstate.maandtotaal += rekening["month_" + maandnummer];
            console.log(rekening)
            let foundaccount = accounts.find(account => account.description === rekening.rekening);
            if(foundaccount == null && rekening["month_" + maandnummer] > 0){
                currentstate.succeeded = false;
                currentstate.accountsExist.push(rekening.rekening)
                console.log("Rekening bestaat niet: " + rekening.rekening);
            }
        });
        console.log(currentstate);
        if((parseFloat(algemeen_account.balance.value)) < bunqSettings.income){
            currentstate.balanceSufficient = false;
            currentstate.succeeded = false;
        }
        console.log(currentstate);
        if((currentstate.maandtotaal + bunqSettings.keep) > bunqSettings.income){
            currentstate.incomeSufficient = false;
            currentstate.sparen = 0;
            currentstate.succeeded = false;
        }else{
            
            currentstate.sparen = (bunqSettings.income - currentstate.maandtotaal - bunqSettings.keep);
            console.log(currentstate);
            if(currentstate.balanceSufficient){
                currentstate.sparen = (currentstate.sparen + (Math.round(algemeen_account.balance.value) - bunqSettings.income));
            }
            console.log(currentstate);
            if(currentstate.sparen < 0){
                currentstate.sparen = 0;
                currentstate.incomeSufficient = false;   
                currentstate.succeeded = false;
            }else{
                currentstate.incomeSufficient = true;
            }
            
        }
        console.log(currentstate);
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
                let overboeking = await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: "Algemeen", to: rekening.rekening, description: "Geld apart zetten", amount: rekening["totaal_" + maandnummer].toString() + '.00'}, auth});
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
        let overboeking = await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: "Algemeen", to: "Spaar", description: "Geld sparen", amount: preconditions.sparen.toString() + '.00'}, auth});
        console.log(overboeking);
        let accounts = await fetchBackend('/api/bunq/accounts', {auth})
        setAccounts(accounts);
        setScriptRunning(false);
        //this.setState({accounts: accounts, script_running: false});
    }
    
    const sum = (array, key) => array.reduce((a, b) => a + (b[key] || 0), 0);
    
 
    const getTotal = (cellInfo) => {
        let total = 0
        if(groupedData.length > 0){
            for (let rekening of groupedData) {
              total += rekening[cellInfo.column.id]
            }
            let sparen = (bunqSettings.income - bunqSettings.keep - total);
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
        Cell: props => <span>{accounts.find(account => account.description === props.value) !== undefined ? '€'+accounts.find(account => account.description === props.value).balance.value : '€-'}</span> // Custom cell components!
    }]
    for(var i = 1; i < 13; i++){
        rekeningColumns.push({
            Header: months[i-1],
            accessor: 'totaal_'+i,
            Footer: getTotal
        });
    }
    
    const formItems = [
        {name: 'salaris', type: 'input', label: 'Netto salaris:', value: bunqSettings.income, changehandler: (e) => {setBunqSettings({...bunqSettings, income: e.target.value})}},
        {name: 'eigen_geld', type: 'input', label: 'Eigen geld:', value: bunqSettings.keep, changehandler: (e) => {setBunqSettings({...bunqSettings, keep: e.target.value})}}
    ]
    
    const formButtons = [
        {id: 'checkpreconditions', click: checkPreconditions, disabled: accountsLoading || script_running, text: 'Controleer'},
        {id: 'runscript', click: runScript, disabled: script_running || preconditions.succeeded === false, text: 'Boeken'}
    ]
    
    return (<div><h1>Bunq</h1>
            <DefaultTable data={groupedData} columns={rekeningColumns} loading={rekeningenLoading} pageSize={15}/>
            <DefaultFormRow data={formItems} buttons={formButtons}/>
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
