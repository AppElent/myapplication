const fetch = require('node-fetch')
import moment from 'moment';

export default class Tado {

  constructor(api_key) {
    this.api_key = api_key;
    this.host = 'https://monitoringapi.solaredge.com';
  }
  
  fetchTado = async (url, options) => {
      const response = await fetch(url, options);
      if(response.status !== 200) {
          throw new Error("Error fetching SolarEdge data from URL " + url + ": " + response.status + " - " + response.statusText);
      }
      const data = await response.json();
      return data;
  }

  getData = async (site, start, end, period) => {
    const response = await this.fetchSolarEdge(this.host + '/site/' + site + '/energy?timeUnit=' + period.toUpperCase() + '&endDate=' + end + '&startDate=' + start + '&api_key=' + this.api_key);
    return response;
  }

  getSiteData = async () => {
    const response = await this.fetchSolarEdge(this.host + '/sites/list?size=1&api_key=' + this.api_key);
    return response;
  }

  getEquipmentData = async (site) => {
    const response = await this.fetchSolarEdge(this.host + '/equipment/' + site + '/list?size=1&api_key=' + this.api_key);
    return response;
  }

  
}


