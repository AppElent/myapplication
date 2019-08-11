const Cache = require('./Cache');
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;
const Encryption = require('./Encryption')
const path = require("path");
const _ = require('lodash');

export default class BunqClient {

  constructor() {
    this.status;
    this.bunqJSClient;
    this.user;
    this.longCache = new Cache(9999999);
    this.shortCache = new Cache(300);
  }
  
  getObject(object){
      const objectKeys = Object.keys(object);
      const objectKey = objectKeys[0];

      return object[objectKey];
  };

  defaultErrorLogger(error){
    console.log('bunq error', error)
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

  
  async initialize(filename, access_token, encryption_key, options){
      //Status zetten
      this.status = 'STARTING';
      
      //bunqclient zetten
      const filestore = customStore(path.resolve(__dirname, "../../../config/bunq/" + filename + '.json' ));
      this.bunqJSClient = new BunqJSClient(filestore);
      
      // load and refresh bunq client
      this.environment = 'PRODUCTION';
      if(options.env !== undefined) this.environment = options.env;
      console.log("Running bunqclient", access_token, this.environment, encryption_key);
      await this.bunqJSClient.run(access_token, ['*'], this.environment, encryption_key).catch(this.defaultErrorLogger);

      // disable keep-alive since the server will stay online without the need for a constant active session
      this.bunqJSClient.setKeepAlive(false);

      console.log("create/re-use a system installation");
      await this.bunqJSClient.install().catch(this.defaultErrorLogger);

      console.log("create/re-use a device installation")
      try{
        await this.bunqJSClient.registerDevice('EricsApp');
      }catch(err){
        console.log( "Fout bij laden van BunqClient met bestandsnaam " + filename);
        return;
      }
      

      console.log("create/re-use a bunq session installation")
      await this.bunqJSClient.registerSession().catch(this.defaultErrorLogger);
      
      //Requestlimiter zetten
      if(options.requestLimiter !== undefined) this.bunqJSClient.ApiAdapter.RequestLimitFactory = options.requestLimiter; 
      
      // get user info connected to this account
      const users = await this.bunqJSClient.getUsers(true).catch(this.defaultErrorLogger);
      this.user = users[Object.keys(users)[0]];
      
      this.status = 'READY';
  }
  
  getBunqJSClient(){
    return this.bunqJSClient;
  }
  
  getUsers(){
      return this.user;
  }
  
  getUser(){
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
  
  async createRequestInquiry(from, description, amount, counterparty, options = {}){
      const accounts = await this.getAccounts();
      const from_account = accounts.find(account => account[from.type] === from.value)
      if (from_account === null) {
          console.log ("Van account bestaat niet: ", from);
          return false;
      }
      const inquiry = await this.bunqJSClient.api.requestInquiry.post(this.user.id, from_account.id, description, amount, counterparty, options).catch(this.defaultErrorLogger);
      return inquiry;
  }
  
  async createBunqMeTab(from, description, amount, options = {}){
      const accounts = await this.getAccounts();
      const from_account = accounts.find(account => account[from.type] === from.value)
      if (from_account === null) {
          console.log ("Van account bestaat niet: ", from);
          return false;
      }
      const bunqmetab = await this.bunqJSClient.api.bunqMeTabs.post(this.user.id, from_account.id, description, amount, options).catch(this.defaultErrorLogger);
      return bunqmetab;
  }
  
  async getEvents(options = {}, forceUpdate = false){
      const cachekey = 'allevents';
      if(forceUpdate) this.shortCache.del(cachekey);
      const events = this.shortCache.get(cachekey, async () => {return (await this.bunqJSClient.api.event.list(this.user.id).catch(this.defaultErrorLogger))});
      return events;
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

