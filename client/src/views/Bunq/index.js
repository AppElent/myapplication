import React, { useState, useEffect, useContext } from 'react';

//import { ListGroup} from 'react-bootstrap';
//import DefaultTable from '../components/DefaultTable';
//import DefaultFormRow from '../components/DefaultFormRow';
import useFetch from '../../hooks/useFetch';
import useStateExtended from '../../hooks/useStateExtended';
import useLocalStorage from '../../hooks/useLocalStorage';
//import BunqPaymentModal from '../components/BunqPaymentModal'
//import { AuthContext } from '../context/AuthContext';
import fetchBackend from '../../helpers/fetchBackend';
//import { Button} from 'react-bootstrap';
import _ from 'lodash';

const Bunq = () => {
    
  const sum = (array, key) => array.reduce((a, b) => a + (b[key] || 0), 0);
    
  const groupData = (key) => (xs) => {
    const object = xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
      //let result = []
    const result = Object.entries(object).map((item) => {
      //const sum = this.sum(item[1], 'month_1')
      let array = {rekening: item[0], entries: item[1]}
      for(var i = 1; i<13; i++){
        const sumvalue = _.sumBy(item[1], 'month_' + i);
        array['month_' + i] = sumvalue
      }
      return array;
    });
    return result
  }
    

  const initialPreconditions = {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null, logging: {preconditions_run: false}}
    
  const [bunqSettings, setBunqSettings] = useLocalStorage('bunq_settings', {from: '', spaar: '', income: 0, keep: 0})
  const [accounts, setAccounts, accountsLoading, accountsError, accountsRequest] = useFetch('/api/bunq/accounts', {onMount: true})
  const [preconditions, setPreconditions, checking, setChecking] = useStateExtended(initialPreconditions);
  const [rekeningen, setRekeningen, rekeningenLoading, rekeningenError, rekeningenRequest] = useFetch('/api/rekeningen', {onMount: true, postProcess: groupData('rekening')})
  const [script_running, setScriptRunning] = useState(false);
    
  const maandnummer = (new Date()).getMonth()+1;
    
  const checkPreconditions = () => {
    //check
    const algemeen_account = accounts.find(account => account.description === bunqSettings.from);
    let currentstate = {...preconditions};
    currentstate.succeeded = true;
    currentstate.maandtotaal = 0;
    currentstate.incomeSufficient = true;
    currentstate.balanceSufficient = true;
        
    currentstate.balance = algemeen_account.balance.value;
    rekeningen.map(rekening => {
      currentstate.maandtotaal += rekening['month_' + maandnummer];
      currentstate.logging[rekening.rekening] = {success: true, message: ''}
      let foundaccount = accounts.find(account => account.description === rekening.rekening);
      if(foundaccount == null && rekening['month_' + maandnummer] > 0){
        currentstate.succeeded = false;
        currentstate.logging[rekening.rekening].message = 'Bestaat niet';
      }
    });
    if((parseFloat(algemeen_account.balance.value)) < bunqSettings.income){
      currentstate.balanceSufficient = false;
      currentstate.succeeded = false;
    }
    if((currentstate.maandtotaal + bunqSettings.keep) > bunqSettings.income){
      currentstate.incomeSufficient = false;
      currentstate.sparen = 0;
      currentstate.succeeded = false;
    }else{
            
      currentstate.sparen = (bunqSettings.income - currentstate.maandtotaal - bunqSettings.keep);
      if(currentstate.balanceSufficient){
        currentstate.sparen = (currentstate.sparen + (Math.round(algemeen_account.balance.value) - bunqSettings.income));
      }
      if(currentstate.sparen < 0){
        currentstate.sparen = 0;
        currentstate.incomeSufficient = false;   
        currentstate.succeeded = false;
      }else{
        currentstate.incomeSufficient = true;
      }
            
    }
    currentstate.logging.preconditions_run = true;
    setPreconditions(currentstate);
  }
    
  const runScript = async () => {
    //check
    setScriptRunning(true);
    //this.setState({script_running: true});

    for (var rekening of rekeningen){
      console.log('Naar rekening ' + rekening.rekening + ' moet ' + rekening['month_' + maandnummer] + ' euro worden overgemaakt.');
      if(rekening['month_' + maandnummer] > 0){
        let overboeking = await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: {type: 'description', value: bunqSettings.from}, to: {type: 'description', value: rekening.rekening}, description: 'Geld apart zetten', amount: rekening['month_' + maandnummer].toString() + '.00'}});
        if(overboeking.success === false) setPreconditions({...preconditions, logging: {...preconditions.logging, [rekening.rekening]: {success: false, message: overboeking.message.Error[0].error_description}}})
        console.log(overboeking);
      }
    }
    console.log('Erna');
    if(bunqSettings.spaar !== ''){
      let overboeking = await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: {type: 'description', value: bunqSettings.from}, to: {type: 'description', value: bunqSettings.spaar}, description: 'Geld sparen', amount: preconditions.sparen.toString() + '.00'}});
      console.log(overboeking); 
      if(overboeking.success === false) setPreconditions({...preconditions, logging: {...preconditions.logging, [rekening.rekening]: {success: false, message: overboeking.message.Error[0].error_description}}})
    }

    await accountsRequest.get('/api/bunq/accounts', '?forceUpdate=true')
    setPreconditions(initialPreconditions)
    setScriptRunning(false);
  }
    

  const getTotal = (cellInfo) => {
    let total = 0
    if(rekeningen.length > 0){
      for (let rekening of rekeningen) {
        total += rekening[cellInfo.column.id]
      }
      let sparen = (bunqSettings.income - bunqSettings.keep - total);
      return (<div>{total}<br />{sparen}</div>);
    }
  }
    
   
  const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
  const rekeningColumns = []
    
  if(preconditions.succeeded || preconditions.logging.preconditions_run) rekeningColumns.push({
    Header: 'Foutmelding',
    accessor: 'rekening', // String-based value accessors!
    Cell: props => <span>{preconditions.logging[props.value] !== undefined ? preconditions.logging[props.value].message : ''}</span>
  })
    
  rekeningColumns.push({
    Header: 'Rekening',
    accessor: 'rekening', // String-based value accessors!
    Footer: <div><b>Totaal:</b><br /><b>Sparen:</b></div>
  },{
    Header: 'Huidig saldo',
    accessor: 'rekening', // String-based value accessors!
    Cell: props => <span>{accounts.find(account => account.description === props.value) !== undefined ? '€'+accounts.find(account => account.description === props.value).balance.value : '€-'}</span> // Custom cell components!
  })
  for(var i = 1; i < 13; i++){
    rekeningColumns.push({
      Header: months[i-1],
      accessor: 'month_'+i,
      Footer: getTotal
    });
  }
    
  const formItems = [
    {name: 'from', type: 'input', label: 'Van rekening:', value: bunqSettings.from, changehandler: (e) => {setBunqSettings({...bunqSettings, from: e.target.value})}},
    {name: 'spaar', type: 'input', label: 'Spaarrekening:', value: bunqSettings.spaar, changehandler: (e) => {setBunqSettings({...bunqSettings, spaar: e.target.value})}},
    {name: 'salaris', type: 'input', label: 'Netto salaris:', value: bunqSettings.income, changehandler: (e) => {setBunqSettings({...bunqSettings, income: e.target.value})}},
    {name: 'eigen_geld', type: 'input', label: 'Eigen geld:', value: bunqSettings.keep, changehandler: (e) => {setBunqSettings({...bunqSettings, keep: e.target.value})}}
  ]
    
  const formButtons = [
    {id: 'checkpreconditions', click: checkPreconditions, disabled: accountsLoading || script_running, text: 'Controleer'},
    {id: 'runscript', click: runScript, disabled: script_running || preconditions.succeeded === false, text: 'Boeken'}
  ]
    
  return (<div><h1>Bunq</h1>
    {/*
    <Button variant="primary" onClick={() => {accountsRequest.get('/api/bunq/accounts', '?forceUpdate=true')}} disabled={accountsLoading}>Flush cache</Button>
    
    <DefaultTable data={rekeningen} columns={rekeningColumns} loading={rekeningenLoading} pageSize={15}/>
    <DefaultFormRow data={formItems} buttons={formButtons}/>
    <ListGroup>
      {preconditions.balance !== null ?<ListGroup.Item variant="success">Huidig saldo Algemene rekening: {preconditions.balance}</ListGroup.Item> : ""}
      {preconditions.accountsExist.map((rek, i) => {return <ListGroup.Item  key={i} variant="danger">Rekening {rek} bestaat niet</ListGroup.Item>})}
      {preconditions.balanceSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende saldo. Salaris nog niet binnen?</ListGroup.Item> : ""}
      {preconditions.incomeSufficient === false ? <ListGroup.Item variant="danger">Niet voldoende inkomen om alle rekeningen te betalen</ListGroup.Item> : ""}
      {preconditions.sparen !== null ? <ListGroup.Item variant="success">Er wordt {preconditions.sparen} gespaard</ListGroup.Item> : ""}
    </ListGroup>
    <BunqPaymentModal accounts={accounts} />*/}
  </div>
  );

}

export default Bunq
