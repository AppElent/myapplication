
import fetchBackend from 'helpers/fetchBackend';


export const checkPreconditions = (accounts, from_account, rekeningen, bunqSettings, options = {}) => {
  //check
  const maandnummer = options.maandnummer || (new Date()).getMonth()+1;
  
  
  const initialPreconditions = {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null, logging: {preconditions_run: false}}
  const algemeen_account = accounts.find(account => account.description === from_account);
  let currentstate = {...initialPreconditions};
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
  return JSON.stringify(currentstate);
  //setPreconditions(currentstate);
}
  
export const runSalarisVerdelenScript = async (accounts, from_account, rekeningen, bunqSettings, sparen, options = {}) => {
  //check
  //------setScriptRunning(true); ----------
  //this.setState({script_running: true});
  const maandnummer = options.maandnummer || (new Date()).getMonth()+1;

  for (var rekening of rekeningen){
    console.log('Naar rekening ' + rekening.rekening + ' moet ' + rekening['month_' + maandnummer] + ' euro worden overgemaakt.');
    if(rekening['month_' + maandnummer] > 0){
      let overboeking = null;//-----await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: {type: 'description', value: bunqSettings.from}, to: {type: 'description', value: rekening.rekening}, description: 'Geld apart zetten', amount: rekening['month_' + maandnummer].toString() + '.00'}});
      //-----if(overboeking.success === false) setPreconditions({...preconditions, logging: {...preconditions.logging, [rekening.rekening]: {success: false, message: overboeking.message.Error[0].error_description}}})
      console.log(overboeking);
    }
  }
  console.log('Erna');
  if(bunqSettings.spaar !== ''){
    let overboeking = null;//----await fetchBackend('/api/bunq/payment', {method: 'POST', body: {from: {type: 'description', value: bunqSettings.from}, to: {type: 'description', value: bunqSettings.spaar}, description: 'Geld sparen', amount: sparen.toString() + '.00'}});
    console.log(overboeking); 
    //-----if(overboeking.success === false) setPreconditions({...preconditions, logging: {...preconditions.logging, [rekening.rekening]: {success: false, message: overboeking.message.Error[0].error_description}}})
  }

  //-----await accountsRequest.get('/api/bunq/accounts', '?forceUpdate=true')
  //-----setPreconditions(initialPreconditions)
  //-----setScriptRunning(false);
}