const db = require('../config/db.config.js');
const BunqClientWrapper = require('./BunqClientWrapper')
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;
const path = require("path");

module.exports = class BunqWrapper {

  constructor() {
  
    this.status = 'STARTING';
    try{
      this.storage = customStore(path.resolve(__dirname, "../../../bunq/genericClient.json" ));
      this.genericBunqClient = new BunqJSClient(this.storage);
    }catch(e){}
    
    
    this.requestLimiter;
    this.bunqClients = {}
    
  }
  
  async startup(){
      //alle clients laden
      const allclients = await db.apisettings.findAll({where: {name: 'bunq'}});
      //eerste client laden
      const client1 = allclients.shift();
      console.log('Eerste client laden', client1.user);
      this.bunqClients[client1.user] = new BunqClientWrapper(client1);
      await this.bunqClients[client1.user].initialize();
      this.requestLimiter = this.bunqClients[client1.user].getBunqJSClient().ApiAdapter.RequestLimitFactory
      
      //rest laden
      const result = await Promise.all(allclients.map(async (clientsetting) => {
          this.bunqClients[clientsetting.user] = new BunqClientWrapper(clientsetting, this.requestLimiter);
          console.log('loading client ' + clientsetting.user)
          await this.bunqClients[clientsetting.user].initialize();
          console.log('client loaded ' + clientsetting.user)
      }))
  }
  
  async installNewClient(clientsetting){
    this.bunqClients[clientsetting.user] = new BunqClientWrapper(clientsetting, this.genericBunqClient.ApiAdapter.RequestLimitFactory);
    await this.bunqClients[clientsetting.user].initialize();
    return this.bunqClients[clientsetting.user];
  }
  
  getGenericClient(){
    //get generic client (to generate keys etc)
    return this.genericBunqClient;
  }

  
  getClient(identifier){
    //get client by identifier
    return this.bunqClients[identifier];
  }
  
  
}

