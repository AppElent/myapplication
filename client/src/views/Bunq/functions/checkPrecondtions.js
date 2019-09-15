

const checkPreconditions = (accounts, from_account, rekeningen, bunqSettings) => {
  //check
  const maandnummer = (new Date()).getMonth()+1;


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

export default checkPreconditions;