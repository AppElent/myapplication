//const db = require('../models/index.js');
import BunqClient from './BunqClient';
import BunqJSClient from '@bunq-community/bunq-js-client';
//const BunqJSClient = require("@bunq-community/bunq-js-client").default;
import customStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore"; 
//const customStore = require( "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore").default;
const path = require("path");

export class Bunq {

  constructor() {
  
    this.status = 'STARTING';
    this.storage = customStore(path.resolve(__dirname, "../../../config/bunq/genericClient.json" ));
    this.genericBunqClient = new BunqJSClient(this.storage);
    
    this.requestLimiter;
    this.bunqClients = {}
    
  }

  async load(key, filename, access_token, encryption_key, environment, options){
    this.bunqClients[key] = new BunqClient(environment);
    await this.bunqClients[key].initialize(filename, access_token, encryption_key, environment, options);
  }
  /*
  async startup(){
      //alle clients laden
      const allclients = await db.apisettings.findAll({where: {name: 'bunq'}});
      if(allclients.length === 0) return;
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
  
  async installNewClient(key, filename, access_token, encryption_key, options){
    this.bunqClients[clientsetting.user] = new BunqClientWrapper(clientsetting, this.genericBunqClient.ApiAdapter.RequestLimitFactory);
    await this.bunqClients[clientsetting.user].initialize();
    return this.bunqClients[clientsetting.user];
  }
  */
  
  getGenericClient(){
    //get generic client (to generate keys etc)
    return this.genericBunqClient;
  }

  
  getClient(identifier){
    //get client by identifier
    return this.bunqClients[identifier];
  }
  
  
}


export const bunq = new Bunq();
