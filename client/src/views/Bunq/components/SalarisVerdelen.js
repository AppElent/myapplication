import React, {useState} from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';


import useStateExtended from 'hooks/useStateExtended';
import fetchBackend from 'helpers/fetchBackend';

import checkPreconditions from '../functions/checkPrecondtions';
import ScriptDialog from './ScriptDialog';


const useStyles = makeStyles(theme => ({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  refreshButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));

const SalarisVerdelen = ({accounts, accountsRequest, rekeningen}) => {
  const classes = useStyles();

  /*
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
  */

  const maandnummer = (new Date()).getMonth()+1;
  const initialPreconditions = {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null, logging: {preconditions_run: false}}

  //const [rekeningen, setRekeningen, rekeningenLoading, rekeningenError, rekeningenRequest] = useFetch('/api/rekeningen', {onMount: true, postProcess: groupData('rekening')})
  const [bunqSettings, setBunqSettings] = useState({from: '', spaar: '', income: 3150, keep: 80})
  //const [accounts, setAccounts, accountsLoading, accountsError, accountsRequest] = useFetch('/api/bunq/accounts', {onMount: true})
  const [preconditions, setPreconditions, checking, setChecking] = useStateExtended(initialPreconditions);
  const [script_running, setScriptRunning] = useState(false);
  
  

    
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

  const getRekeningColumns = () => {
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    const rekeningColumns = []
    
    if(preconditions.succeeded || preconditions.logging.preconditions_run) rekeningColumns.push({
      title: 'Foutmelding',
      field: 'rekening'
    })
      
    rekeningColumns.push({
      title: 'Rekening',
      field: 'rekening', // String-based value accessors!
    },{
      title: 'Huidig saldo',
      field: 'rekening', // String-based value accessors!
    })
    for(var i = 1; i < 13; i++){
      rekeningColumns.push({
        title: months[i-1],
        field: 'month_'+i
      });
    }
    return rekeningColumns;
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

  return (  
    <div className={classes.content}>
      <ScriptDialog />
      <MaterialTable 
        columns={getRekeningColumns()}
        data={rekeningen}
        options={{
          paging: false,
          padding: 'dense'
          
        }}
        title="Rekeningen gegroepeerd"
      />
      {accounts[0] !== undefined && checkPreconditions(accounts, accounts[0].description, rekeningen, bunqSettings)}
    </div>
  )

}

SalarisVerdelen.propTypes = {
  data: PropTypes.array,
  loadBunqData: PropTypes.bool,
  onClick: PropTypes.func
};

export default SalarisVerdelen;