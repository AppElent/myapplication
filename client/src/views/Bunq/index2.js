import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import _ from 'lodash';


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

const Bunq = () => {
    
  const sum = (array, key) => array.reduce((a, b) => a + (b[key] || 0), 0);
    

    

  const initialPreconditions = {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null, logging: {preconditions_run: false}}
    
  const [bunqSettings, setBunqSettings] = useLocalStorage('bunq_settings', {from: '', spaar: '', income: 0, keep: 0})
  const [accounts, setAccounts, accountsLoading, accountsError, accountsRequest] = useFetch('/api/bunq/accounts', {onMount: true})
  const [preconditions, setPreconditions, checking, setChecking] = useStateExtended(initialPreconditions);
  const [rekeningen, setRekeningen, rekeningenLoading, rekeningenError, rekeningenRequest] = useFetch('/api/rekeningen', {onMount: true, postProcess: groupData('rekening')})
  const [script_running, setScriptRunning] = useState(false);
    
  
    

    
   
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
    
    <Button variant="contained" color="primary" onClick={() => {accountsRequest.get('/api/bunq/accounts', '?forceUpdate=true')}} disabled={accountsLoading}>Flush cache</Button>
    {/*
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
