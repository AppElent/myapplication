const db = require('../config/db.config.js');
const Cache = require('../classes/Cache');
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;
const Encryption = require('../classes/Encryption')
const path = require("path");
const _ = require('lodash');

module.exports = class BunqClientWrapper {

  constructor(entry, requestLimiter = null) {
      this.settings = entry;
      this.encryption = new Encryption();
      this.longCache = new Cache(9999999);
      this.shortCache = new Cache(300);
      this.bunqJSClient;
      this.requestLimiter = requestLimiter;
      this.user;
      this.status = 'UNINITIALIZED';
  }
  
  getObject(object){
      const objectKeys = Object.keys(object);
      const objectKey = objectKeys[0];

      return object[objectKey];
  };

  defaultErrorLogger(error){
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  };
  
  returnErrorLogger(error){
    if (error.response) {
      return {success: false, message: error.response.data}
    }
    return {success: false, message: error}
  }

  
  async initialize(){
      //Status zetten
      this.status = 'STARTING';
      
      //Als data1 leeg is dan moeten we hier een verwijzing naar storage zetten
      if(this.settings.data1 === null) this.settings = await this.settings.update({data1: this.encryption.generateRandomKey(16)})
      
      //Als er geen key is dan moeten we die aanmaken
      if(this.settings.refresh_token === null) this.settings = await this.settings.update({refresh_token: this.encryption.generateRandomKey(16)})
      
      //bunqclient zetten
      const filestore = customStore(path.resolve(__dirname, "../bunq/" +this.settings.data1 + '.json' ));
      this.bunqJSClient = new BunqJSClient(filestore);
      
      // load and refresh bunq client
      let bunqEnv = 'PRODUCTION';
      if(this.settings.data2 !== null) bunqEnv = this.settings.data2;
      await this.bunqJSClient.run(this.settings.access_token, [], bunqEnv, this.settings.refresh_token).catch( exception => { throw exception; } );

      // disable keep-alive since the server will stay online without the need for a constant active session
      this.bunqJSClient.setKeepAlive(false);

      // create/re-use a system installation
      await this.bunqJSClient.install().catch(this.defaultErrorLogger);

      // create/re-use a device installation
      await this.bunqJSClient.registerDevice('EricsApp').catch(this.defaultErrorLogger);

      // create/re-use a bunq session installation
      await this.bunqJSClient.registerSession().catch(this.defaultErrorLogger);
      
      //Requestlimiter zetten
      if(this.requestLimiter !== null) this.bunqJSClient.ApiAdapter.RequestLimitFactory = this.requestLimiter; 
      
      // get user info connected to this account
      const users = await this.bunqJSClient.getUsers(true).catch(this.defaultErrorLogger);
      this.user = users[Object.keys(users)[0]];
      
      this.status = 'READY';
  }
  
  getBunqJSClient(){
    return this.bunqJSClient;
  }
  
  async getUsers(){
      return this.user;
  }
  
  async getAccounts(forceUpdate = false){
      const cachekey = 'allaccounts';
      if(forceUpdate) this.longCache.del(cachekey);
      const results = this.longCache.get(cachekey, async () => {
        const accounts = await this.bunqJSClient.api.monetaryAccount.list(this.user.id).catch(this.defaultErrorLogger);
        const resultList = []
        for(var account of accounts){
          let entry = (this.getObject(account));
          entry['monetary_bank_account_type'] = Object.keys(account)[0]
          resultList.push(entry)
        }
        return (_.orderBy(resultList, ['description'],['asc']))
      })

      
      return results;
  }
  
  async makePaymentInternal(from, to, description, amount) {
      const accounts = await this.getAccounts();
      
      const from_account = accounts.find(account => account[from.type] === from.value)
      const to_account = accounts.find(account => account[from.type] === to.value)
      if (from_account == null) {
          console.log ("Van account bestaat niet: ", from);
          return false;
      }
      if (to_account == null) {
          console.log ("To account bestaat niet: ", to);
          return false;
      }
      
      const counterpartyAlias = to_account.alias.find(alias => alias.type === 'IBAN');//this.getAliasByType(to_account, "IBAN");
      const paymentResponse = await this.bunqJSClient.api.payment.post(
          this.user.id,
          from_account.id,
          description,
          { value: amount, currency: "EUR" },
          counterpartyAlias
      ).catch(this.returnErrorLogger);
      
      // iets met paymentResponse doen hier
      return paymentResponse;
  }
  
  async makeDraftPayment(from, to, description, amount) {
      const accounts = await this.getAccounts();
      
      const from_account = accounts.find(account => account[from.type] === from.value)
      if (from_account == null) {
          console.log ("Van account bestaat niet: ", from);
          return false;
      }
      console.log(from, to, description, amount)
      const paymentResponse = await this.bunqJSClient.api.draftPayment.post(
          this.user.id,
          from_account.id,
          description,
          { value: amount, currency: "EUR" },
          to
      ).catch(this.returnErrorLogger);
      return paymentResponse
  }

  
}

