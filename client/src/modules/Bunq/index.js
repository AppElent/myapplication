
import fetchBackend from 'helpers/fetchBackend';


export const checkPreconditions = (accounts, rekeningen, options = {}) => {
  //check
  const maandnummer = options.maandnummer || (new Date()).getMonth()+1;
  const from_account = options.from_account;

  
  const initialPreconditions = {run: false, succeeded: false, accountsExist: [], balanceSufficient: true, incomeSufficient: true, sparen: null, maandtotaal: 0, balance: null, logging: {preconditions_run: false}}
  const algemeen_account = accounts.find(account => account.description === from_account);
  let currentstate = {...initialPreconditions};
  currentstate.succeeded = true;
  currentstate.maandtotaal = 0;
  currentstate.incomeSufficient = true;
  currentstate.balanceSufficient = true;
          
  currentstate.balance = algemeen_account === undefined ? 0 : algemeen_account.balance.value;
  rekeningen.map(rekening => {
    currentstate.maandtotaal += rekening['month_' + maandnummer];
    currentstate.logging[rekening.rekening] = {success: true, message: ''}
    let foundaccount = accounts.find(account => account.description === rekening.rekening);
    if(foundaccount == null && rekening['month_' + maandnummer] > 0){
      currentstate.succeeded = false;
      currentstate.logging[rekening.rekening].message = 'Bestaat niet';
      currentstate.accountsExist.push('Account ' + rekening.rekening + ' bestaat niet');
    }
  });
  if((parseFloat(currentstate.balance)) < options.income){
    currentstate.balanceSufficient = false;
    currentstate.succeeded = false;
  }
  currentstate.sparen = (currentstate.balance - currentstate.maandtotaal);
  if(options.keep !== undefined) currentstate.sparen = currentstate.sparen - options.keep;

  if(currentstate.sparen < 0) currentstate.sparen = 0;
  if((currentstate.maandtotaal + options.keep) > options.income){
    currentstate.incomeSufficient = false;
    currentstate.succeeded = false;
  }else{
              
    if(currentstate.sparen < 0){
      currentstate.incomeSufficient = false;   
      currentstate.succeeded = false;
    }else{
      currentstate.incomeSufficient = true;
    }
              
  }
  currentstate.logging.preconditions_run = true;
  return currentstate;
  //setPreconditions(currentstate);
}
  
export const runSalarisVerdelenScript = async (rekeningen, options = {}) => {
  const maandnummer = options.maandnummer || (new Date()).getMonth()+1;
  const logger = options.logger || console.log;
  const user = options.user;

  for (var rekening of rekeningen){
    logger('Naar rekening ' + rekening.rekening + ' moet ' + rekening['month_' + maandnummer] + ' euro worden overgemaakt.');
    if(rekening['month_' + maandnummer] > 0){
      let overboeking = await fetchBackend('/api/bunq/payment', {user, method: 'POST', body: {from: {type: 'description', value: options.from_account}, to: {type: 'description', value: rekening.rekening}, description: 'Geld apart zetten', amount: rekening['month_' + maandnummer].toString() + '.00'}});
      if(overboeking.success) {
        logger('----> Succesvol');
      }else{
        logger('----> Error: ' + overboeking.message);
      }
      console.log(overboeking);
    }
  }
  console.log('Erna');
  if(options.move_rest){
    const sparen = Math.round(options.sparen);
    logger('Naar de spaarrekening wordt ' + sparen + ' overgemaakt');
    let overboeking = await fetchBackend('/api/bunq/payment', {user, method: 'POST', body: {from: {type: 'description', value: options.from_account}, to: {type: 'description', value: options.savings_account}, description: 'Geld sparen', amount: sparen.toString() + '.00'}});
    if(overboeking.success) {
      logger('----> Succesvol');
    }else{
      logger('----> Error: ' + overboeking.message);
    }
    console.log(overboeking); 
  }
}



export const deleteBunqSettings = async (ref) => {
  await ref.update({bunq: {success: false}});
}