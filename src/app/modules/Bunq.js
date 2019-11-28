import BunqClient from './BunqClient';
import BunqJSClient from '@bunq-community/bunq-js-client';
import customStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore"; 
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
    this.bunqClients[key] = new BunqClient();
    await this.bunqClients[key].initialize(filename, access_token, encryption_key, environment, options)
  }
  
  getGenericClient(){
    //get generic client (to generate keys etc)
    return this.genericBunqClient;
  }

  
  getClient(identifier){
    if(!this.bunqClients[identifier]) throw 'Cannot find bunq connection'
    //get client by identifier
    return this.bunqClients[identifier];
  }
  
  
}


export const bunq = new Bunq();
